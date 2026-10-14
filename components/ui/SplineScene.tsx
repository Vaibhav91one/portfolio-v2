"use client";

import { Component, type ReactNode } from "react";
// Static ESM import lives here so the footer can lazy-load this file with next/dynamic
// (@splinetool/react-spline only exports an "import" condition, which a direct dynamic() of the package can't resolve).
import Spline from "@splinetool/react-spline";

// If the 3D scene throws (no WebGL, e.g. in a crawler), drop the bot instead of crashing the whole page
// with Next's "Application error" screen.
class SplineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SplineScene({ scene }: { scene: string }) {
  return (
    <SplineBoundary>
      <Spline scene={scene} />
    </SplineBoundary>
  );
}
