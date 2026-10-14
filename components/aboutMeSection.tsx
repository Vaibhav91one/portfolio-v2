"use client";

import React, { useRef } from "react";
import { useCursor } from "./ui/Cursor";
import Button from "./ui/Button";
import { ArrowRight, Mail } from "lucide-react";
import DNA from "./svgComponents/dna";
import Compass from "./svgComponents/compass";
import Star from "./svgComponents/star";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import SplitType from "split-type";
import MagneticButton from "./ui/Magnetic";

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
      if (rotatingIcon) {
        gsap.to(rotatingIcon, {
          rotation: 360,
          repeat: -1, // Infinite rotation
          duration: 3, // One full rotation every 3 seconds
          ease: "linear",
        });
      }

      // Select the h1 element inside sectionRef safely
      const titleElement = sectionRef.current?.querySelector(".titleAbout") as HTMLElement | null;

      if (titleElement) {
        // Only run this on screens wider than 768px (you can adjust this breakpoint)
        const splitTitle = new SplitType(titleElement, { types: "chars" });
      
        if (splitTitle.chars) {
          t2.from(splitTitle.chars, {
            y: 50,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
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

    // if (!textRef.current) return;

    // const elements = textRef.current.querySelectorAll("h1, p");
    // const splitInstances: any[] = [];

    // const allLines: HTMLElement[] = [];

    // elements.forEach((el) => {
    //   const split = new SplitType(el as HTMLElement, {
    //     types: "lines",
    //     lineClass: "split-line", // optional class for styling
    //   });
    //   splitInstances.push(split);
    //   if (split.lines) {
    //     allLines.push(...split.lines);
    //   }
      
    // });

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: textRef.current,
    //     start: "top bottom",
    //     end: "top center",
    //     scrub: true,
    //   },
    // });

    // tl.from(allLines, {
    //   opacity: 0,
    //   y: 80,
    //   stagger: 0.2,
    //   duration: 1.5,
    //   ease: "power2.out",
    // });

    // return () => {
    //   splitInstances.forEach((split) => split.revert());
    //   ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // };
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
        className="container-x min-h-screen py-24 flex items-center flex-col justify-center gap-20"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
          <div className="flex items-center justify-center text-center">
            <h2
              onMouseEnter={() => scaleCursor(8)}
              onMouseLeave={() => scaleRevertCursor()}
              className="titleAbout text-[clamp(2.5rem,12vw,6rem)] lg:text-[5.5vw] whitespace-nowrap"
            >
              <span className="animate-slow-spin inline-block">✺</span>{" "}
              ABOUT ME
            </h2>
          </div>

          <div className="flex flex-col items-center lg:items-start justify-center py-12">
            <div
              ref={textRef}
              className="flex flex-col items-center gap-6 md:gap-8"
            >
                <p className="text-lg md:text-xl lg:text-2xl font-regular">
                  A Swiss-army-knife(-ish!) Design Engineer — crafting playful,
                  minimal, and functional experiences where design meets code.
                </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl">
                I solve problems through code — always learning, always
                refining.
              </p>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl">
                I build with JavaScript, TypeScript, and Python — using tools
                like Next.js, React, GSAP, TailwindCSS, and Docker. I care about
                clean code, security, and good API design.
              </p>

              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl">
                Currently at JPL (Jio Platforms Limited) — working on building
                internal tools for streamlining tasks and team efficiency. Open
                to new opportunities.
              </p>
            </div>
            <Button
              href="mailto:vaibhavtomar3003@gmail.com"
              className="main-btn mt-16"
              title="GET IN TOUCH"
              icon={Mail}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default aboutMeSection;
