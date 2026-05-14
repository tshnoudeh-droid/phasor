"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import type { Message } from "@/types/chat";

const SUGGESTIONS = [
  "Simulate a spring with k=25 N/m, mass=1 kg, damping=1.5, released from 1 m",
  "Pendulum with 0.8 m arm released from 30°",
  "Projectile at 45° with launch speed 20 m/s",
  "RC circuit: R=1000Ω, C=1mF, charging from 0 to 5V",
  "PID controller: Kp=10, Ki=5, Kd=2, setpoint=1",
];

interface Props {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatPanel({ messages, onSend, isLoading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3 animate-fade-in">
            <p className="text-phasor-muted text-xs font-mono uppercase tracking-wider">
              Try a prompt
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="animate-slide-up text-left text-xs text-phasor-muted hover:text-phasor-snow
                    border border-phasor-border hover:border-phasor-electric
                    hover:shadow-[0_0_10px_var(--phasor-electric-glow)]
                    rounded px-3 py-2 transition-all duration-200 active:scale-[0.99]"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
      </div>
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
