"use client";

import React, { useEffect, useRef } from "react";
import Button from "./ui/Button";
import { ArrowDown, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useCursor } from "./ui/Cursor";
import Image from "next/image";
import ProfilePicture from "../public/assets/Images/no Bg.png";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (xPercent < -100) {
      xPercent = 0;
    } else if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    requestAnimationFrame(animate);
    xPercent += 0.02 * direction;
  };

  useGSAP(() => {
    const t1 = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    t1.from(".title", {
      y: 20,
      opacity: 0,
      delay: 2,
      duration: 0.4, // Smooth transition (1 second)
      ease: "power2.out", // Eases out for a smoother effect
    }).from(".btnRef", {
      x: 50,
      opacity: 0,
      duration: 0.8, // Slightly faster (0.8 seconds)
      ease: "power2.out",
      delay: 0.2, // Adds a slight delay after title animation
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
    <>
    <div ref={heroRef} className="relative">
      <div  className="relative flex justify-center max-h-screen items-center overflow-hidden bg-gray-500">
      
        <div>
          <Image
            src={ProfilePicture}
            alt="Your Photo"
            width={500}
            height={500}
            className="object-cover -translate-y-20"
          />
        </div>
        <div
          className="absolute right-20 flex justify-center items-start
         flex-col text-3xl gap-2"
        >
          <p className="font-regular text-white">Software Developer</p>
          <p className="font-regular text-white">Freelancer</p>
        </div>

        <div
          className="absolute left-0 rounded-l-md rounded-r-full flex justify-center items-center
          text-3xl gap-12 bg-black p-5"
        >
          <p className="text-white w-30">Located in India</p>

          <div className="bg-gray-400 rounded-full">
            <Globe className="text-white rounded-full m-4 animate-rotate-slow" size={40} />
          </div>
        </div>
      </div>
      <div className="absolute top-screen-minus-350">
        <div ref={slider} className="relative whitespace-nowrap">
          <p
            ref={firstText}
            className="relative m-0 text-white text-[200px] font-medium pr-[50px]"
          >
            Vaibhav Tomar -
          </p>

          <p
            ref={secondText}
            className="absolute left-[100%] top-0 m-0 text-white text-[200px] font-medium pr-[50px]"
          >
            Vaibhav Tomar -
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroSection;
