"use client";

import React, { useRef } from "react";
import { useCursor } from "./ui/Cursor";
import Button from "./ui/Button";
import { ArrowRight } from "lucide-react";
import DNA from "./svgComponents/dna";
import Compass from "./svgComponents/compass";
import Star from "./svgComponents/star";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const aboutMeSection = (props: Props) => {
  const { scaleCursor, scaleRevertCursor } = useCursor();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(() => {
    const t2 = gsap.timeline();

    if (sectionRef.current) {
      // **Rotate the ✺ icon using class selector**
      const rotatingIcon = sectionRef.current.querySelector(
        ".rotate-icon"
      ) as HTMLElement | null;
      console.log(rotatingIcon);
      if (rotatingIcon) {
        gsap.to(rotatingIcon, {
          rotation: 360,
          repeat: -1, // Infinite rotation
          duration: 3, // One full rotation every 3 seconds
          ease: "linear",
        });
      }

      // Select the h1 element inside sectionRef safely
      const titleElement = sectionRef.current.querySelector(
        ".titleAbout"
      ) as HTMLElement | null;

      if (titleElement) {
        // Split h1 title into characters
        const splitTitle = new SplitType(titleElement, { types: "chars" });

        if (splitTitle.chars) {
          t2.from(splitTitle.chars, {
            y: 50, // Start from -50px on X-axis
            opacity: 0,
            delay: 3, // Delay before animation starts
            stagger: 0.05, // Stagger effect (each character animates 0.05s apart)
            duration: 0.8, // Smooth transition duration
            ease: "power2.out",
            scrollTrigger: {
              trigger: splitTitle.chars,
              start: "top bottom",
              end: "bottom center",
              scrub: true,
            },
          });
        }
      }
    }

    if (textRef.current) {
      // Split text into lines & characters
      const splitLines = new SplitType(textRef.current, {
        types: "lines",
      });

      if (!splitLines.lines) return;

      // Ensure splitLines.chars and splitLines.lines exist
      if (!splitLines.lines.length) return;

      // GSAP animation for lines (staggered fade-in effect)
      t2.from(splitLines.lines, {
        opacity: 0.3,
        y: 100,
        delay: 3, // Delay before animation starts
        stagger: 0.5,
        duration: 3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: splitLines.lines,
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      });

      return () => {
        splitLines.revert(); // Revert text to original state
      };
    }
  }, []);

  useGSAP(() => {
    gsap.to(sectionRef.current, {
      y: -50,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "center center",
        // end: 'bottom center',
        scrub: true,
      },
    });
  });

  return (
    <>
      <div
        ref={sectionRef}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-5 lg:gap-1">
          <div className="flex items-center justify-center text-center">
            <h1
              onMouseEnter={() => scaleCursor(8)}
              onMouseLeave={() => scaleRevertCursor()}
              className="titleAbout text-clamp-about"
            >
              <span className="animate-slow-spin inline-block">✺</span>{" "}
              <span className="text-nowrap">ABOUT </span> ME
            </h1>
          </div>
          <div className="flex flex-col items-start justify-center gap-15 px-10 lg:px-0">
            <div ref={textRef} className="text-clamp-xl">
              I approach all things design with a distinct blend
              <span>
                {" "}
                <DNA />{" "}
              </span>{" "}
              of play and minimalism, seamlessly{" "}
              <span>
                {" "}
                <Compass />{" "}
              </span>{" "}
              navigating design challenges and delivering functional +
              delightful{" "}
              <span>
                {" "}
                <Star />{" "}
              </span>{" "}
              solutions.
            </div>
            <Button
              className="main-btn  .btnRef"
              title="MORE ABOUT ME"
              icon={ArrowRight}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default aboutMeSection;
