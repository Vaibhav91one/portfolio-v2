// app/robot/page.tsx or app/page.tsx

import Spline from "@splinetool/react-spline";

export default function Robot() {
  return (
    <div className="absolute top-0 z-[-99] opacity-0 lg:opacity-50 pointer-events-none">
      <Spline scene="https://prod.spline.design/M4S11dvJnr65ej9S/scene.splinecode" />
    </div>
    );
}
