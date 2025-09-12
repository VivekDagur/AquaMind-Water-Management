import { useMutation } from "@tanstack/react-query";

export const useChat = () => {
  return useMutation({
    mutationFn: async ({ message, context, conversationId }) => {
      const base = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000/api").replace(/\/$/, "");
      const response = await fetch(`${base}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message, context, conversationId }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chat API request failed");
      }

      return response.json();
    },
  });
};
