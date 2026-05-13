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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-phasor-muted text-sm">
              Describe any physical system in plain English.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="text-left text-xs text-phasor-muted hover:text-phasor-snow border border-phasor-border hover:border-phasor-electric rounded px-3 py-2 transition-colors"
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
