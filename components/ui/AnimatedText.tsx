"use client"

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import gsap from "gsap";

const AnimatedParagraph = ({ description }: { description: string }) => {
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split text into lines & characters
    const splitLines = new SplitType(textRef.current, { types: "lines,chars" });

    if (!splitLines.lines || !splitLines.chars) return;
    if (!splitLines.lines.length || !splitLines.chars.length) return;

    gsap.set(textRef.current, { opacity: 1 });

    // Initially hide lines
    gsap.set(splitLines.lines, { opacity: 0, x: 50 });

    // Staggered fade-in effect for lines
    gsap.to(splitLines.lines, {
      opacity: 1,
      x: 0,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: splitLines.lines,
        start: "top 140%",
        scrub: true,
      },
    });

    // Character hover effect
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      gsap.fromTo(
        target,
        { opacity: 0, y: -5, rotationX: 180 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.4, ease: "power2.out" }
      );
    };

    // Attach event listeners to each character
    splitLines.chars.forEach((char) => {
      if (char instanceof HTMLElement) {
        char.style.display = "inline-block"; // Prevents layout shifting
        char.addEventListener("mouseenter", handleMouseEnter);
      }
    });

    // Cleanup function
    return () => {
      splitLines.revert(); // Revert text to original state
      splitLines.chars?.forEach((char) => {
        if (char instanceof HTMLElement) {
          char.removeEventListener("mouseenter", handleMouseEnter);
        }
      });
    };
  }, []);

  return (
    <p ref={textRef} className="text-lg md:text-xl mt-2 leading-relaxed opacity-0">
      {description}
    </p>
  );
};

export default AnimatedParagraph;
