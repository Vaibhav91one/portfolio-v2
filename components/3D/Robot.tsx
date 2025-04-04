// app/page.tsx (or wherever you’re using it)
'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline').then(mod => mod.default), {
  ssr: false,
});

export default function Robot() {
  return (
    <main className='w-fit h-full'>
      <Spline 
      scene="https://prod.spline.design/M4S11dvJnr65ej9S/scene.splinecode" />
    </main>
  );
}
