"use client";

import { useCallback, useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import SliderPanel from "@/components/sim/SliderPanel";
import EquationDisplay from "@/components/sim/EquationDisplay";
import SimErrorBoundary from "@/components/sim/SimErrorBoundary";
import ChatPanel from "@/components/chat/ChatPanel";
import { useSimulation } from "@/hooks/useSimulation";
import { useConversation } from "@/hooks/useConversation";
import { useSliders } from "@/hooks/useSliders";
import { getSolver } from "@/lib/solvers";
import type { SystemType } from "@/types/simulation";

const SimCanvas = dynamic(() => import("@/components/sim/SimCanvas"), { ssr: false });

function SimPageInner() {
  const { result, runDebounced, run } = useSimulation();
  const { messages, isLoading, currentSystem, send } = useConversation();
  const searchParams = useSearchParams();
  const autoSentRef = useRef(false);
  const { values, sliderConfig, initFromParams, onChange } = useSliders(currentSystem);
  const [shareStatus, setShareStatus] = useState<"idle" | "saving" | "copied">("idle");

  const handleSave = useCallback(async () => {
    if (!result) return;
    setShareStatus("saving");
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemType: result.systemType,
          parameters: result.parameters,
          conversation: messages
            .filter((m) => !m.isLoading)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("save failed");
      const { slug } = (await res.json()) as { slug: string };
      const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/s/${slug}`;
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    } catch {
      setShareStatus("idle");
    }
  }, [result, messages]);

  const handleSend = useCallback(
    (message: string) => {
      send(message, (systemType: SystemType, params: Record<string, number>) => {
        const solver = getSolver(systemType);
        if (!solver) return null;
        const merged = { ...solver.defaultParams, ...params };
        initFromParams(merged);
        return run(systemType, merged);
      });
    },
    [send, initFromParams, run]
  );

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !autoSentRef.current) {
      autoSentRef.current = true;
      handleSend(q);
    }
  }, [searchParams, handleSend]);

  const handleSliderChange = useCallback(
    (key: string, value: number) => {
      if (!currentSystem) return;
      onChange(key, value, (nextParams) => {
        runDebounced(currentSystem, nextParams, 100);
      });
    },
    [currentSystem, onChange, runDebounced]
  );

  const solver = currentSystem ? getSolver(currentSystem) : null;

  return (
    <div className="flex flex-col h-screen bg-phasor-void overflow-hidden">
      <Navbar />

      {/* Simulation panel */}
      <div
        className="flex border-b border-phasor-border shrink-0"
        style={{ flex: "0 0 55%" }}
      >
        {/* Canvas + sliders */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 relative overflow-hidden">
            {result ? (
              <SimErrorBoundary>
                <div key={result.systemType} className="animate-fade-in w-full h-full">
                  <SimCanvas
                    states={result.states}
                    systemType={result.systemType}
                    width={800}
                    height={220}
                  />
                </div>
              </SimErrorBoundary>
            ) : isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-phasor-surface animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-56 h-px bg-phasor-border relative overflow-hidden shimmer-bar" />
                  <span className="text-phasor-muted text-xs font-mono tracking-widest">
                    solving
                    <span
                      className="inline-block"
                      style={{
                        animation: "dot-bounce 1.2s ease-in-out infinite",
                        animationDelay: "0ms",
                      }}
                    >.</span>
                    <span
                      className="inline-block"
                      style={{
                        animation: "dot-bounce 1.2s ease-in-out infinite",
                        animationDelay: "180ms",
                      }}
                    >.</span>
                    <span
                      className="inline-block"
                      style={{
                        animation: "dot-bounce 1.2s ease-in-out infinite",
                        animationDelay: "360ms",
                      }}
                    >.</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-phasor-surface animate-fade-in">
                <p className="text-phasor-muted/60 text-sm font-mono">
                  describe a system below
                </p>
              </div>
            )}
          </div>
          {result && solver && (
            <div className="animate-slide-up">
              <SliderPanel
                config={sliderConfig}
                values={values}
                onChange={handleSliderChange}
              />
            </div>
          )}
        </div>

        {/* Equation panel — hidden on mobile */}
        <div className="hidden md:flex w-52 shrink-0 border-l border-phasor-border bg-phasor-surface overflow-hidden flex-col transition-colors duration-300">
          {result && solver ? (
            <>
              <div className="flex-1 overflow-hidden animate-fade-in">
                <EquationDisplay
                  equationLatex={solver.equationLatex}
                  systemType={result.systemType}
                  parameters={result.parameters}
                  metrics={result.metrics}
                />
              </div>
              <div className="border-t border-phasor-border p-2.5">
                <button
                  onClick={handleSave}
                  disabled={shareStatus !== "idle"}
                  className="w-full text-xs font-mono py-1.5 border border-phasor-border
                    text-phasor-muted hover:text-phasor-electric hover:border-phasor-electric
                    hover:shadow-[0_0_10px_var(--phasor-electric-glow)]
                    active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {shareStatus === "saving"
                    ? "saving..."
                    : shareStatus === "copied"
                    ? "link copied ✓"
                    : "share"}
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4 text-center animate-fade-in">
              <p className="text-phasor-muted/60 text-xs leading-relaxed font-mono">
                equations and metrics appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function SimPage() {
  return (
    <Suspense>
      <SimPageInner />
    </Suspense>
  );
}
