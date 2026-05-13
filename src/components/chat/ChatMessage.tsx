"use client";

import type { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (message.isLoading) {
    return (
      <div className="flex gap-2 items-start">
        <div className="text-xs text-phasor-muted font-mono w-12 pt-0.5 shrink-0">phasor</div>
        <div className="flex gap-1 items-center py-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-phasor-muted animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-start ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`text-xs font-mono pt-0.5 shrink-0 w-12 ${
          isUser ? "text-right text-phasor-muted" : "text-phasor-electric"
        }`}
      >
        {isUser ? "you" : "phasor"}
      </div>
      <div
        className={`max-w-[80%] rounded px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-phasor-border text-phasor-snow"
            : "bg-phasor-surface border border-phasor-border text-phasor-snow"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
