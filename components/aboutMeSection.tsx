"use client";

import React, { useRef } from "react";
import { useCursor } from "./ui/Cursor";
import Button from "./ui/Button";
import { ArrowRight, Link } from "lucide-react";
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
        className="max-w-[1300px] h-[120vh] mx-auto min-h-screen flex items-center flex-col justify-center gap-20"
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

          <div className="flex flex-col items-center lg:items-start  justify-center px-6 py-12 lg:px-20 max-w-5xl mx-auto">
            <div
              ref={textRef}
              className="flex flex-col items-center gap-6 md:gap-8"
            >
              <h1 className="text-lg md:text-xl lg:text-2xl font-regular">
                A Swiss-army-knife(-ish!) developer with a love for playful,
                minimal, and functional design.
              </h1>
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
            <a
              href="https://drive.google.com/file/d/1a-1PrSYjHAtb_VPHy1jDiPXmniV99qbl/view?usp=sharing"
              target="_blank"
            >
              <Button
                className="main-btn  btnRef mt-16 "
                title="GET MY RESUME"
                icon={Link}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default aboutMeSection;
