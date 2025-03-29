"use client";

import React, { useEffect, useRef } from "react";
import Button from "./ui/Button";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useCursor } from "./ui/Cursor";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scaleCursor, scaleRevertCursor } = useCursor();

  useGSAP(() => {
    const t1 = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    t1.from(".title", { 
      y: 100, 
      opacity: 0, 
      duration: 1,  // Smooth transition (1 second)
      ease: "power2.out" // Eases out for a smoother effect
    })
      .from(".btnRef", { 
        x: 50, 
        opacity: 0, 
        duration: 0.8, // Slightly faster (0.8 seconds)
        ease: "power2.out", 
        delay: 0.2 // Adds a slight delay after title animation
      });
    

    // Parallax effects
    if (heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.to(heroRef.current, {
          y: "-20%",
          scale: 0.8,
          opacity: 0,
          ease: "none",
        }),
      });
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top bottom",
        scrub: 1,
        animation: gsap.to(".title", { delay: 1, y: "-10%" }),
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top center",
        scrub: 1,
        animation: gsap.to(".btnRef", { y: "-5%", x: -50 }),
      });
    }
  });


  useEffect(() => {
    if (!textRef.current) return;

    // Split text into lines & characters
    const splitLines = new SplitType(textRef.current, { types: "lines,chars" });

    if (!splitLines.lines) return;
    if (!splitLines.chars) return;

    // Ensure splitLines.chars and splitLines.lines exist
    if (!splitLines.lines.length || !splitLines.chars.length) return;

    gsap.set(textRef.current, { opacity: 1 });

    // 🔥 FIX: Hide text initially using GSAP `set()`
    gsap.set(splitLines.lines, { opacity: 0, x: 50 });

    // GSAP animation for lines (staggered fade-in effect)
    gsap.to(splitLines.lines, {
      opacity: 1,
      x: 0,
      delay: 0.3, // Delay before animation starts
      stagger: 0.2,
      ease: "power2.out",
    });

    // Function to animate a single character on hover
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      gsap.fromTo(
        target,
        { opacity: 0, y: -5, rotationX: 180 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.4, ease: "power2.out" }
      );
    };

    // Attach event listeners to each character for hover effect
    splitLines.chars.forEach((char) => {
      if (char instanceof HTMLElement) {
        char.style.display = "inline-block"; // Prevents layout shifting
        char.addEventListener("mouseenter", handleMouseEnter);
      }
    });

    // Cleanup function (removes event listeners & reverts SplitType)
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
    <div
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center lg:justify-evenly items-center"
    >
      <div className="flex justify-center items-center">
        <h2
          className="title text-clamp"
          onMouseEnter={() => scaleCursor(10)}
          onMouseLeave={() => scaleRevertCursor()}
        >
          Vaibhav
        </h2>
      </div>

      <div className="grid xs:grid-cols-1 lg:grid-cols-5 gap-10 p-4">
        {/* Content Box - Responsive Width */}
        <div className="col-span-2">
          <p ref={textRef} className="text-[15px] opacity-0">
            Hello there — I'm Vaibhav, an agile designer hopping across digital
            and physical worlds. Currently creating impactful visual experiences
            @ TGC EG.
          </p>
        </div>

        <div className="col-start-2 lg:col-start-4">
          <Button
            ref={btnRef}
            className="btnRef"
            title="SCROLL TO EXPLORE"
            icon={ArrowDown}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
