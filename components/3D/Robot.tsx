// app/robot/page.tsx or app/page.tsx
'use client';

import Spline from '@splinetool/react-spline';

export default function Robot() {
  return (
    <main className="w-fit h-full">
      <Spline scene="https://prod.spline.design/M4S11dvJnr65ej9S/scene.splinecode" />
    </main>
  );
}
