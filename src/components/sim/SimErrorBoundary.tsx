"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class SimErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-phasor-surface">
          <p className="text-phasor-muted text-sm font-mono">
            Simulation error — try adjusting the parameters.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
