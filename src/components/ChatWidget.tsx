// src/components/ChatWidget.tsx
import React, { useState, useRef, useEffect } from "react";
import { type Tank } from "@/utils/mockData";

interface Kpis {
  totalWaterStored: number;
  totalCapacity: number;
  utilizationPercentage: number;
  communityTanks: number;
  avgDailyConsumption: number;
  nextRefillETA?: number | null;
  criticalTankCount: number;
  lowTankCount: number;
}

interface ChatWidgetProps {
  projectSummary?: string;
  selectedTank?: Tank;
  kpis?: Kpis;
  apiBase?: string;
}

type Message = {
  role: "user" | "assistant";
  text: string;
};

interface ChatResponse {
  reply: string;
  conversationId?: string | null;
}

function isChatResponse(obj: unknown): obj is ChatResponse {
  if (typeof obj !== "object" || obj === null) return false;
  const record = obj as Record<string, unknown>;
  return (
    typeof record.reply === "string" &&
    (typeof record.conversationId === "string" ||
      record.conversationId === undefined ||
      record.conversationId === null)
  );
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  projectSummary = "This project monitors tanks, levels, consumption and alerts.",
  selectedTank,
  kpis,
  apiBase,
}) => {
  interface MinimalSpeechRecognition {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    onresult: ((event: unknown) => void) | null;
    onend: (() => void) | null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello — ask me about the project, tanks or KPIs." },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [messages]);

  // ✅ API Base resolver (env या props से)
  const getApiBase = (): string => {
    if (apiBase) return apiBase.replace(/\/$/, "");
    const envBase =
      (import.meta.env.VITE_API_URL as string | undefined) ?? undefined;
    if (envBase) return envBase.replace(/\/$/, "");
    return "http://localhost:5000/api";
  };

  // Capture page content for context
  const getPageContent = (): string => {
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const parts: string[] = [];
      let node: Node | null = walker.nextNode();
      while (node) {
        const text = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (text.length > 0) parts.push(text);
        if (parts.join(" ").length > 6000) break;
        node = walker.nextNode();
      }
      const title = document.title ? `Title: ${document.title}\n\n` : "";
      return title + parts.join(" ").slice(0, 6000);
    } catch {
      return "";
    }
  };

  // Init voice recognition
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => MinimalSpeechRecognition;
      webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
    };
    const SpeechRecognitionImpl = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SpeechRecognitionImpl) {
      const rec = new SpeechRecognitionImpl();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (event: unknown) => {
        const e = event as { results?: Array<Array<{ transcript?: string }>> };
        const transcript = e.results?.[0]?.[0]?.transcript ?? "";
        if (transcript) setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const startListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try { rec.stop(); } catch { /* no-op */ }
  };

  const speak = (text: string) => {
    if (!ttsEnabled) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch { /* no-op */ }
  };

  // Built-in responses for common queries
  const getBuiltInResponse = (query: string): string | null => {
    const q = query.toLowerCase().trim();
    
    // Greetings
    if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/)) {
      return "Hello! I'm your AquaMind AI assistant. I can help you with water management, tank monitoring, and system insights. What would you like to know?";
    }
    
    // Basic questions about AquaMind
    if (q.includes("what is aquamind") || q.includes("what does aquamind do")) {
      return "AquaMind is a smart water management system that provides real-time tank monitoring, AI-powered insights, and predictive analytics. It helps reduce water waste by up to 30% and prevents costly emergencies through intelligent alerts.";
    }
    
    if (q.includes("how does it work") || q.includes("how it works")) {
      return "AquaMind works by connecting to your water tanks through IoT sensors, monitoring levels in real-time, analyzing usage patterns, and providing intelligent recommendations. The system sends alerts for low levels, predicts maintenance needs, and helps optimize water consumption.";
    }
    
    if (q.includes("features") || q.includes("what can you do")) {
      return "Key AquaMind features include:\n• Real-time tank monitoring\n• Smart alerts and notifications\n• AI-powered usage optimization\n• Predictive maintenance insights\n• Historical data analysis\n• Mobile-responsive dashboard\n• Cost savings tracking";
    }
    
    if (q.includes("benefits") || q.includes("why use")) {
      return "AquaMind benefits:\n• Reduce water waste by 30%\n• Prevent costly overflow incidents\n• Lower operational costs\n• Ensure regulatory compliance\n• Optimize maintenance schedules\n• Real-time monitoring from anywhere\n• Improve sustainability metrics";
    }
    
    // Tank-related queries
    if (q.includes("tank") && (q.includes("level") || q.includes("status"))) {
      if (selectedTank) {
        const capacity = selectedTank.capacity_liters;
        const current = selectedTank.current_liters;
        return `Tank "${selectedTank.name}" status:\n• Capacity: ${capacity}L\n• Current Level: ${current}L\n• Status: ${selectedTank.status || "Active"}\n• Location: ${selectedTank.location || "Not specified"}`;
      }
      return "I can provide tank information when you select a specific tank from the dashboard. The system monitors water levels, capacity, and status in real-time.";
    }
    
    // KPI queries
    if (q.includes("kpi") || q.includes("statistics") || q.includes("usage")) {
      if (kpis) {
        return `Current System KPIs:\n• Total Water Stored: ${kpis.totalWaterStored}L\n• Total Capacity: ${kpis.totalCapacity}L\n• Utilization: ${kpis.utilizationPercentage}%\n• Community Tanks: ${kpis.communityTanks}\n• Avg Daily Consumption: ${kpis.avgDailyConsumption}L`;
      }
      return "KPIs show your water system performance including total capacity, current usage, efficiency metrics, and consumption patterns. Access the dashboard to view detailed analytics.";
    }
    
    // Help and support
    if (q.includes("help") || q === "?") {
      return "I can help you with:\n• Understanding AquaMind features\n• Tank monitoring and status\n• Usage analytics and KPIs\n• Water optimization tips\n• System troubleshooting\n• General water management advice\n\nJust ask me anything about water management!";
    }
    
    // Pricing and business
    if (q.includes("price") || q.includes("cost") || q.includes("pricing")) {
      return "AquaMind offers flexible pricing:\n• Basic Plan: $29/month (up to 5 tanks)\n• Professional: $99/month (up to 25 tanks, AI insights)\n• Enterprise: $299/month (unlimited tanks, custom integrations)\n\nAll plans include real-time monitoring, alerts, and mobile access.";
    }
    
    // Technical questions
    if (q.includes("how to") && q.includes("install")) {
      return "AquaMind installation is simple:\n1. Connect IoT sensors to your tanks\n2. Configure sensor settings in dashboard\n3. Set alert thresholds\n4. Start monitoring!\n\nOur team provides full setup support and training.";
    }
    
    // Goodbye
    if (q.match(/^(bye|goodbye|thanks|thank you)$/)) {
      return "You're welcome! Feel free to ask me anything about AquaMind or water management anytime. Have a great day! 💧";
    }
    
    return null;
  };

  const sendMessage = async () => {
    let q = input.trim();
    if (!q) return;

    // One-shot speak command: "/speak your question" will voice only this reply
    const shouldSpeakOnce = q.toLowerCase().startsWith("/speak ");
    if (shouldSpeakOnce) q = q.slice(7).trim();

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");

    // Check for built-in responses first
    const builtInResponse = getBuiltInResponse(q);
    if (builtInResponse) {
      setMessages((prev) => [...prev, { role: "assistant", text: builtInResponse }]);
      if (shouldSpeakOnce || ttsEnabled) speak(builtInResponse);
      return;
    }

    const context = { projectSummary, selectedTank, kpis, pageContent: getPageContent() };

    try {
      const base = getApiBase();

      // Try reliable non-streaming first to avoid SSE proxy/CORS hiccups
      const res2 = await fetch(`${base}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, conversationId, context }),
      });
      const json2: unknown = await res2.json();
      if (isChatResponse(json2)) {
        const { reply, conversationId: newConvId } = json2;
        if (newConvId) setConversationId(newConvId);
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
        if (shouldSpeakOnce || ttsEnabled) speak(reply);
        return;
      }

      // Fallback to SSE streaming if non-streaming didn't return expected shape
      const streamUrl = `${base}/ai/chat/stream?` + new URLSearchParams({
        query: q,
        ...(conversationId ? { conversationId } : {}),
        context: JSON.stringify(context),
      }).toString();

      const res = await fetch(streamUrl, { headers: { Accept: "text/event-stream" } });
      if (res.ok && res.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let assistant = "";
        setMessages((prev) => [...prev, { role: "assistant", text: "" }]);
        let idx: number | null = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n\n")) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const payload = t.slice(5).trim();
            try {
              const json = JSON.parse(payload);
              if (json.delta) {
                assistant += json.delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  if (idx === null) idx = copy.length - 1;
                  copy[idx] = { role: "assistant", text: assistant };
                  return copy;
                });
              }
              if (json.conversationId) setConversationId(json.conversationId);
            } catch {
              // ignore non-JSON lines
            }
          }
        }
        if (assistant && (shouldSpeakOnce || ttsEnabled)) speak(assistant);
        return;
      }
    } catch (err) {
      console.error("ChatWidget error:", err);
      // Provide helpful fallback response instead of generic error
      const fallbackResponse = "I'm currently running in offline mode, but I can still help you with basic AquaMind questions! Try asking about features, benefits, pricing, or tank monitoring. For advanced AI insights, the backend connection will be restored soon.";
      setMessages((prev) => [...prev, { role: "assistant", text: fallbackResponse }]);
      if (shouldSpeakOnce || ttsEnabled) speak(fallbackResponse);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50"
          aria-label="Open chat"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground rounded-t-lg">
            <strong>AI Assistant</strong>
            <div className="flex items-center gap-2">
              <button
                className="text-sm"
                onClick={() => setTtsEnabled((v) => !v)}
                aria-pressed={ttsEnabled}
                title={ttsEnabled ? "Mute voice" : "Enable voice"}
              >
                {ttsEnabled ? "🔊" : "🔈"}
              </button>
              {recognitionRef.current && (
                <button
                  className="text-sm"
                  onClick={() => (isListening ? stopListening() : startListening())}
                  aria-pressed={isListening}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? "🛑" : "🎤"}
                </button>
              )}
              <button
                className="text-sm"
                onClick={() => {
                  setMessages([
                    { role: "assistant", text: "Hello — ask me about the project, tanks or KPIs." },
                  ]);
                  setConversationId(null);
                }}
              >
                Reset
              </button>
              <button onClick={() => setIsOpen(false)} aria-label="Close">
                ✖
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            style={{ height: 320, overflowY: "auto", padding: 12 }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: m.role === "user" ? "#e6f0ff" : "#f0fdf4",
                    maxWidth: "85%",
                  }}
                >
                  <div style={{ fontSize: 14 }}>{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void sendMessage();
              }}
              placeholder="Ask about the project..."
              className="flex-1 p-2 outline-none"
            />
            <button
              onClick={() => void sendMessage()}
              className="bg-primary text-primary-foreground px-4"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
