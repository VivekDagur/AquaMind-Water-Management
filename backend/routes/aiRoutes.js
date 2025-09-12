import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import OpenAILog from "../models/OpenAILog.js";

dotenv.config();

const router = express.Router();

// in-memory fallback cache for resilience (not primary storage)
let demoConversations = [];

const clientOptions = { apiKey: process.env.OPENAI_API_KEY };
if (process.env.OPENAI_PROJECT) {
  // Set project for sk-proj-* keys
  // @ts-ignore - option is supported by the SDK
  clientOptions.project = process.env.OPENAI_PROJECT;
}
if (process.env.OPENAI_BASE_URL) {
  // Allow custom base URL if using a gateway/proxy
  // @ts-ignore - option is supported by the SDK
  clientOptions.baseURL = process.env.OPENAI_BASE_URL;
}
const openai = new OpenAI(clientOptions);

router.post("/ai/chat", async (req, res) => {
  try {
    const { query, conversationId, context } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query (string) required" });
    }

    // System prompt
    const systemPrompt =
      "You are AquaMind assistant. Answer concisely and refer to the app data when useful (tanks, alerts, consumption). Use provided page content to tailor answers.";

    // Build context text
    let contextText = "";
    if (context) {
      if (context.projectSummary) contextText += `Project summary:\n${context.projectSummary}\n\n`;
      if (context.selectedTank) {
        const t = context.selectedTank;
        // Support both frontend shapes
        const capacity = t.capacity_liters ?? t.capacity ?? "unknown";
        const current = t.current_liters ?? t.currentLevel ?? "unknown";
        const avg = t.avg_consumption_lph ?? t.avgDailyConsumption ?? "unknown";
        const status = t.status ?? "unknown";
        contextText += `Selected tank: ${t.name} — capacity ${capacity} L, current ${current} L, avg consumption ${avg}, status ${status}.\n\n`;
      }
      if (context.recentAlerts && Array.isArray(context.recentAlerts)) {
        contextText += `Recent alerts:\n${context.recentAlerts
          .map((a) => `- ${a.title || a.type}: ${a.message || ""}`)
          .join("\n")}\n\n`;
      }
      if (typeof context.pageContent === "string" && context.pageContent.trim()) {
        const clipped = context.pageContent.slice(0, 4000);
        contextText += `Page content (clipped):\n${clipped}\n\n`;
      }
    }

    const userContent = `${contextText}\nUser question: ${query}`;

    // Ensure conversation exists in MongoDB
    let conversationDoc = null;
    if (conversationId) {
      conversationDoc = await Conversation.findById(conversationId).catch(() => null);
    }
    if (!conversationDoc) {
      conversationDoc = new Conversation({ title: "AquaMind Chat" });
      await conversationDoc.save();
    }

    // Save user message
    const userMessageDoc = new Message({
      conversation: conversationDoc._id,
      role: "user",
      content: query,
      model: "gpt-4o-mini"
    });
    await userMessageDoc.save();

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const replyText =
      response.choices?.[0]?.message?.content ?? "Sorry, I couldn't produce an answer.";

    // Save assistant message
    const assistantMessageDoc = new Message({
      conversation: conversationDoc._id,
      role: "assistant",
      content: replyText,
      model: "gpt-4o-mini"
    });
    await assistantMessageDoc.save();

    // Log request/response for audit
    try {
      const usage = response.usage ?? {};
      await new OpenAILog({
        request: { systemPrompt, userContent },
        response,
        model: "gpt-4o-mini",
        tokensUsed: usage.total_tokens ?? undefined,
        costEstimate: undefined
      }).save();
    } catch (_) {
      // ignore log failures
    }

    // Maintain simple in-memory cache too
    let conv = demoConversations.find((c) => String(c.id) === String(conversationDoc._id));
    if (!conv) {
      conv = { id: String(conversationDoc._id), messages: [] };
      demoConversations.push(conv);
    }
    conv.messages.push({ role: "user", content: query });
    conv.messages.push({ role: "assistant", content: replyText });

    return res.json({ reply: replyText, conversationId: String(conversationDoc._id) });
  } catch (err) {
    console.error("❌ AI chat error:", err);

    try {
      // Fallback: persist conversation and return heuristic reply so UI never breaks
      const { query, conversationId, context } = req.body || {};

      let conversationDoc = null;
      if (conversationId) {
        conversationDoc = await Conversation.findById(conversationId).catch(() => null);
      }
      if (!conversationDoc) {
        conversationDoc = new Conversation({ title: "AquaMind Chat" });
        await conversationDoc.save();
      }

      if (typeof query === "string" && query.length > 0) {
        await new Message({
          conversation: conversationDoc._id,
          role: "user",
          content: query,
          model: "fallback",
        }).save();
      }

      // Simple heuristic reply using provided context
      const parts = [];
      if (context?.projectSummary) parts.push(`Project: ${context.projectSummary}`);
      if (context?.selectedTank) {
        const t = context.selectedTank;
        const capacity = t.capacity_liters ?? t.capacity ?? "?";
        const current = t.current_liters ?? t.currentLevel ?? "?";
        parts.push(`Tank ${t.name}: ${current}/${capacity} L`);
      }
      if (context?.kpis) {
        parts.push(
          `KPIs — Stored: ${context.kpis.totalWaterStored}L, Utilization: ${Math.round(
            context.kpis.utilizationPercentage || 0
          )}%, Tanks: ${context.kpis.communityTanks}`
        );
      }
      const fallbackText =
        (parts.length ? parts.join(". ") + ". " : "") +
        "AI service is temporarily unavailable. This is a local summary based on current page data.";

      await new Message({
        conversation: conversationDoc._id,
        role: "assistant",
        content: fallbackText,
        model: "fallback",
      }).save();

      return res.json({ reply: fallbackText, conversationId: String(conversationDoc._id) });
    } catch (fallbackErr) {
      console.error("❌ Fallback also failed:", fallbackErr);
      return res.status(500).json({ error: "AI temporarily unavailable" });
    }
  }
});

// Fetch conversation history
router.get("/ai/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversation: id }).sort({ createdAt: 1 });
    if (!messages.length) return res.status(404).json({ error: "Conversation not found" });
    res.json({ id, messages });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch conversation" });
  }
});

export default router;

// SSE streaming endpoint
router.get("/ai/chat/stream", async (req, res) => {
  try {
    const query = typeof req.query.query === "string" ? req.query.query : "";
    const conversationId = typeof req.query.conversationId === "string" ? req.query.conversationId : undefined;
    const contextRaw = typeof req.query.context === "string" ? req.query.context : undefined;
    const context = contextRaw ? JSON.parse(contextRaw) : undefined;

    if (!query) {
      res.writeHead(400);
      return res.end("query required");
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    let conversationDoc = null;
    if (conversationId) {
      conversationDoc = await Conversation.findById(conversationId).catch(() => null);
    }
    if (!conversationDoc) {
      conversationDoc = new Conversation({ title: "AquaMind Chat" });
      await conversationDoc.save();
    }

    await new Message({ conversation: conversationDoc._id, role: "user", content: query, model: "gpt-4o-mini" }).save();

    let contextText = "";
    if (context) {
      if (context.projectSummary) contextText += `Project summary:\n${context.projectSummary}\n\n`;
      if (context.selectedTank) {
        const t = context.selectedTank;
        const capacity = t.capacity_liters ?? t.capacity ?? "unknown";
        const current = t.current_liters ?? t.currentLevel ?? "unknown";
        const avg = t.avg_consumption_lph ?? t.avgDailyConsumption ?? "unknown";
        const status = t.status ?? "unknown";
        contextText += `Selected tank: ${t.name} — capacity ${capacity} L, current ${current} L, avg consumption ${avg}, status ${status}.\n\n`;
      }
      if (Array.isArray(context.recentAlerts)) {
        contextText += `Recent alerts:\n${context.recentAlerts.map((a) => `- ${a.title || a.type}: ${a.message || ""}`).join("\n")}\n\n`;
      }
      if (typeof context.pageContent === "string" && context.pageContent.trim()) {
        contextText += `Page content (clipped):\n${context.pageContent.slice(0, 4000)}\n\n`;
      }
    }

    const systemPrompt =
      "You are AquaMind assistant. Answer concisely and refer to the app data when useful (tanks, alerts, consumption). Use provided page content to tailor answers.";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${contextText}\nUser question: ${query}` },
      ],
    });

    let full = "";
    for await (const part of stream) {
      const delta = part.choices?.[0]?.delta?.content || part.choices?.[0]?.message?.content || "";
      if (delta) {
        full += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    await new Message({ conversation: conversationDoc._id, role: "assistant", content: full, model: "gpt-4o-mini" }).save();
    res.write(`data: ${JSON.stringify({ done: true, conversationId: String(conversationDoc._id) })}\n\n`);
    res.end();
  } catch (err) {
    try {
      const msg = (err && err.message) ? err.message : "stream error";
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    } catch {}
  }
});
