"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import SliderPanel from "@/components/sim/SliderPanel";
import EquationDisplay from "@/components/sim/EquationDisplay";
import ChatPanel from "@/components/chat/ChatPanel";
import { useSimulation } from "@/hooks/useSimulation";
import { useConversation } from "@/hooks/useConversation";
import { useSliders } from "@/hooks/useSliders";
import { getSolver } from "@/lib/solvers";
import type { SystemType } from "@/types/simulation";

// Canvas must not SSR
const SimCanvas = dynamic(() => import("@/components/sim/SimCanvas"), { ssr: false });

export default function SimPage() {
  const { result, runDebounced, run } = useSimulation();
  const { messages, isLoading, currentSystem, send } = useConversation();
  const { values, sliderConfig, initFromParams, onChange } = useSliders(currentSystem);

  const handleSend = useCallback(
    (message: string) => {
      send(message, (systemType: SystemType, params: Record<string, number>) => {
        const solver = getSolver(systemType);
        if (!solver) return null;

        // Fill in defaults for missing params
        const merged = { ...solver.defaultParams, ...params };
        initFromParams(merged);
        return run(systemType, merged);
      });
    },
    [send, initFromParams, run]
  );

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

      {/* Simulation panel — ~55% */}
      <div
        className="flex border-b border-phasor-border"
        style={{ flex: "0 0 55%" }}
      >
        {/* Canvas + sliders */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 relative">
            {result ? (
              <SimCanvas
                states={result.states}
                systemType={result.systemType}
                width={800}
                height={220}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-phasor-surface text-phasor-muted text-sm">
                Describe a physical system below to begin.
              </div>
            )}
          </div>
          {result && solver && (
            <SliderPanel
              config={sliderConfig}
              values={values}
              onChange={handleSliderChange}
            />
          )}
        </div>

        {/* Equation panel */}
        <div className="w-52 shrink-0 border-l border-phasor-border bg-phasor-surface overflow-hidden">
          {result && solver ? (
            <EquationDisplay
              equationLatex={solver.equationLatex}
              systemType={result.systemType}
              parameters={result.parameters}
              metrics={result.metrics}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 text-center">
              <p className="text-phasor-muted text-xs leading-relaxed">
                Equations and metrics appear here after simulation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat panel — ~45% */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatPanel messages={messages} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
