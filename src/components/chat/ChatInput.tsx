"use client";

import { useState, useRef, type KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex gap-2 p-3 border-t border-phasor-border">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        disabled={disabled}
        placeholder={placeholder ?? "Type a system or ask a question..."}
        className="flex-1 resize-none bg-phasor-surface border border-phasor-border rounded px-3 py-2
          text-sm text-phasor-snow placeholder:text-phasor-muted
          focus:outline-none focus:border-phasor-electric
          disabled:opacity-50 leading-relaxed"
      />
      <button
        onClick={send}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-phasor-electric text-phasor-void text-sm font-medium rounded
          hover:bg-phasor-trace transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end"
      >
        Send
      </button>
    </div>
  );
}
