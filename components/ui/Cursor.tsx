"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorContextType = {
  cursorRef: React.RefObject<HTMLDivElement>;
  moveCursor: (x: number, y: number) => void;
  scaleCursor: (scale: number) => void;
  scaleRevertCursor: () => void;
};

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const cursorRef = useRef<any>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    // touch / pen: no custom cursor (it would chase taps)
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(cursor, { opacity: 0 });
    xTo.current = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    yTo.current = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    // Fade in once on entry, not a new tween on every mousemove
    let shown = false;
    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(cursor, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    };
    const handleMouseLeave = () => {
      shown = false;
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const moveCursor = (x: number, y: number) => {
    xTo.current?.(x - 10);
    yTo.current?.(y - 10);
  };

  const scaleCursor = (scale: number) => {
    gsap.to(cursorRef.current, {
      scale: scale,
      duration: 0.1,
      ease: "power2.out",
    });
  };

  const scaleRevertCursor = () => {
    gsap.to(cursorRef.current, {
      scale: 1,
      duration: 0.1,
      ease: "power2.out",
    });
  };

  return (
    <CursorContext.Provider value={{ cursorRef, moveCursor, scaleCursor, scaleRevertCursor }}>
      {children}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 h-[20px] w-[20px] bg-gray-200 rounded-full z-50 pointer-events-none mix-blend-difference shadow opacity-0"
      />
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
