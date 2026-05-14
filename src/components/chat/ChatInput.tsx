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

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="flex gap-2 p-3 border-t border-phasor-border bg-phasor-void/60 backdrop-blur-sm transition-colors duration-300">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        disabled={disabled}
        placeholder={placeholder ?? "Describe a physical system..."}
        className="flex-1 resize-none bg-phasor-surface border border-phasor-border
          px-3.5 py-2.5 text-sm text-phasor-snow placeholder:text-phasor-muted/60
          focus:outline-none focus:border-phasor-electric
          focus:shadow-[0_0_16px_var(--phasor-electric-glow)]
          disabled:opacity-40 leading-relaxed
          transition-all duration-200 rounded"
      />
      <button
        onClick={send}
        disabled={!canSend}
        className="px-4 py-2 bg-phasor-electric text-phasor-void text-sm font-medium
          hover:opacity-90 active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
          transition-all duration-150 shrink-0 self-end rounded
          shadow-[0_0_16px_var(--phasor-electric-glow)]
          hover:shadow-[0_0_24px_var(--phasor-electric-glow-strong)]"
      >
        run
      </button>
    </div>
  );
}
