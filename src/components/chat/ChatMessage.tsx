"use client";

import type { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (message.isLoading) {
    return (
      <div className="flex gap-3 items-start animate-fade-in">
        <div className="text-xs text-phasor-electric font-mono pt-0.5 shrink-0 w-12">phasor</div>
        <div className="flex gap-1.5 items-center py-3 px-3 bg-phasor-surface border border-phasor-border rounded">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-phasor-electric"
              style={{
                animation: "dot-bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 items-end animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`text-xs font-mono pb-0.5 shrink-0 w-12 ${
          isUser ? "text-right text-phasor-muted" : "text-phasor-electric"
        }`}
      >
        {isUser ? "you" : "phasor"}
      </div>
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-phasor-electric/10 border border-phasor-electric/25 text-phasor-snow rounded-lg rounded-br-sm"
            : "bg-phasor-surface border border-phasor-border text-phasor-snow rounded-lg rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
