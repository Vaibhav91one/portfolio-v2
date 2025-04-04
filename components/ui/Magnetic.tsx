import React, { useEffect, useRef, ReactElement, cloneElement } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: ReactElement<any>; // Accepts any React element
}

export default function Magnetic({ children }: MagneticProps) {
  const magnetic = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!magnetic.current) return;

    const xTo = gsap.quickTo(magnetic.current, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
    const yTo = gsap.quickTo(magnetic.current, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = magnetic.current!.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const el = magnetic.current;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Ensure we cast cloneElement properly
  return cloneElement(children, {
    ref: magnetic,
  });
}
