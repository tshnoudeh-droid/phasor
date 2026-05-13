"use client";

import { useState, useCallback } from "react";
import type { Message } from "@/types/chat";
import type { SimulationResult, SystemType } from "@/types/simulation";

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

interface ParseResponse {
  systemType: SystemType;
  parameters: Record<string, number>;
  clarificationNeeded?: string | null;
}

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSystem, setCurrentSystem] = useState<SystemType | null>(null);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const msg: Message = { id: makeId(), role, content };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const parse = useCallback(
    async (message: string): Promise<ParseResponse | null> => {
      const history = messages
        .filter((m) => !m.isLoading)
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationHistory: history, currentSystem }),
      });

      if (!res.ok) return null;
      return res.json() as Promise<ParseResponse>;
    },
    [messages, currentSystem]
  );

  const explain = useCallback(
    async (
      question: string,
      simResult: SimulationResult
    ): Promise<string | null> => {
      const history = messages
        .filter((m) => !m.isLoading)
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemType: simResult.systemType,
          parameters: simResult.parameters,
          solverOutput: simResult.metrics,
          conversationHistory: history,
          userQuestion: question,
        }),
      });

      if (!res.ok) return null;
      const data = (await res.json()) as { explanation: string };
      return data.explanation;
    },
    [messages]
  );

  const send = useCallback(
    async (
      userMessage: string,
      onSimResult: (systemType: SystemType, params: Record<string, number>) => SimulationResult | null
    ) => {
      addMessage("user", userMessage);

      const loadingId = makeId();
      setMessages((prev) => [
        ...prev,
        { id: loadingId, role: "assistant", content: "", isLoading: true },
      ]);
      setIsLoading(true);

      try {
        const parseResult = await parse(userMessage);

        if (!parseResult) {
          setMessages((prev) => prev.filter((m) => m.id !== loadingId));
          addMessage("assistant", "I couldn't connect to the AI. Please try again.");
          return;
        }

        if (parseResult.clarificationNeeded) {
          setMessages((prev) => prev.filter((m) => m.id !== loadingId));
          addMessage("assistant", parseResult.clarificationNeeded!);
          return;
        }

        if (parseResult.systemType === "unknown") {
          setMessages((prev) => prev.filter((m) => m.id !== loadingId));
          addMessage(
            "assistant",
            "I couldn't parse that as a physical system. Try describing it differently — for example: 'A spring with k=25 N/m and mass=1 kg'."
          );
          return;
        }

        setCurrentSystem(parseResult.systemType);
        const simResult = onSimResult(parseResult.systemType, parseResult.parameters);

        if (!simResult) {
          setMessages((prev) => prev.filter((m) => m.id !== loadingId));
          addMessage("assistant", "Simulation failed — check that all parameters are valid.");
          return;
        }

        const explanation = await explain(userMessage, simResult);

        setMessages((prev) => prev.filter((m) => m.id !== loadingId));
        addMessage("assistant", explanation ?? "Simulation complete. Adjust the sliders to explore.");
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== loadingId));
        addMessage("assistant", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, parse, explain]
  );

  return { messages, isLoading, currentSystem, send };
}
