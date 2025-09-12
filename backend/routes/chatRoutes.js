import express from "express";

const router = express.Router();

// in-memory demo conversations
let demoConversations = [];

// ✅ Context-aware POST /api/chat (legacy simple echo)
router.post("/chat", (req, res) => {
  const { message, conversationId, context } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // Default reply
  let replyText = `You asked: "${message}". `;

  // Add project summary
  if (context?.projectSummary) {
    replyText += `Project summary: ${context.projectSummary}. `;
  }

  // Add selected tank info
  if (context?.selectedTank) {
    replyText += `Currently monitoring tank "${context.selectedTank.name}" with ${context.selectedTank.current_liters}L stored (capacity ${context.selectedTank.capacity_liters}L). `;
  }

  // Add KPIs info
  if (context?.kpis) {
    replyText += `Total stored water: ${context.kpis.totalWaterStored}L, utilization: ${context.kpis.utilizationPercentage}%, community tanks: ${context.kpis.communityTanks}. `;
    if (context.kpis.nextRefillETA) {
      replyText += `Next refill ETA is about ${context.kpis.nextRefillETA} hours. `;
    }
    if (context.kpis.criticalTankCount > 0 || context.kpis.lowTankCount > 0) {
      replyText += `⚠️ Attention: ${context.kpis.criticalTankCount} critical and ${context.kpis.lowTankCount} low tanks detected. `;
    }
  }

  // Save conversation in-memory
  const convId = conversationId ?? `demo-${Date.now()}`;
  const convIndex = demoConversations.findIndex((c) => c.id === convId);

  if (convIndex >= 0) {
    demoConversations[convIndex].messages.push({ role: "user", content: message });
    demoConversations[convIndex].messages.push({ role: "assistant", content: replyText });
  } else {
    demoConversations.push({
      id: convId,
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: replyText },
      ],
    });
  }

  res.json({ reply: replyText, conversationId: convId });
});

// ✅ GET conversation history
router.get("/conversations/:id", (req, res) => {
  const conv = demoConversations.find((c) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });
  res.json(conv);
});

export default router;
