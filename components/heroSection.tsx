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
    const t1 = gsap.timeline({ defaults: { duration: 1.5, ease: "power2.out" } });

    // Fade in effect for title & button
    t1.from(".title", { y: 100, opacity: 0, stagger: 0.1 });
    t1.from(".btnRef", { x: 50, opacity: 0, stagger: 0.2 });

    // Parallax Scroll Effect
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        y: "-20%", // Moves the section up for a parallax effect
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Makes it smooth
        },
      });

      gsap.to(".title", {
        y: "-10%",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top center",
          scrub: 1,
        },
      });

      gsap.to(".btnRef", {
        y: "-5%",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top center",
          scrub: 1,
        },
      });
    }
  });

  useEffect(() => {
    if (!textRef.current) return;

    const splitText = new SplitType(textRef.current, { types: "lines" });

    gsap.from(splitText.lines, {
      opacity: 0,
      x: 50,
      delay: 0.5,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });

    return () => splitText.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center">
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
          <p ref={textRef} className="text-[15px]">
            Hello there — I'm Vaibhav, an agile designer hopping across digital
            and physical worlds. Currently creating impactful visual experiences
            @ TGC EG.
          </p>
        </div>

        <div className="col-start-2 lg:col-start-4">
          <Button ref={btnRef} className="btnRef" title="SCROLL TO EXPLORE" icon={ArrowDown} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
