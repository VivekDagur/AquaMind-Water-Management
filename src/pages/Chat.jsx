import React, { useState } from "react";
import { useChat } from "@/hooks/useChat";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatMutation = useChat();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await chatMutation.mutateAsync({
        message: input,
        context: { projectSummary: "Smart Tank Project" }, // 👈 Customize
      });

      const aiMessage = { role: "ai", content: res.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "⚠️ Error: " + err.message },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-200 self-end text-right"
                : msg.role === "ai"
                ? "bg-green-200 self-start text-left"
                : "bg-red-200 text-center"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
