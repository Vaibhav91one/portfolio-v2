"use client";

import React, { useEffect, useRef, useState } from "react";
import Image1 from "@/public/assets/Images/1082549.png";
import Image2 from "@/public/assets/Images/2008451.jpg";
import Image3 from "@/public/assets/Images/8921360.jpg";
import Project from "./ui/Project";
import Modal from "./ui/Modal";
import { useCursor } from "./ui/Cursor";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const ProjectsFramer = (props: Props) => {
  const ProjectsFramer = [
    {
      title: "C2 Montreal",

      src: Image1,

      color: "#000000",
    },

    {
      title: "Office Studio",

      src: Image2,

      color: "#8C8C8C",
    },

    {
      title: "Locomotive",

      src: Image3,

      color: "#EFE8D3",
    },

    {
      title: "C2 Montreal",

      src: Image1,

      color: "#000000",
    },

    {
      title: "Office Studio",

      src: Image2,

      color: "#8C8C8C",
    },

    {
      title: "Locomotive",

      src: Image3,

      color: "#EFE8D3",
    },

    {
      title: "Silencio",

      src: Image1,

      color: "#706D63",
    },
  ];

  const quotes = [
    "Creativity is intelligence having fun. — Albert Einstein",
    "Make it simple, but significant. — Don Draper",
    "Design is thinking made visual. — Saul Bass",
    "Creativity takes courage. — Henri Matisse",
    "Your work is your signature. Make it legendary.",
    "Dream big. Create bigger.",
    "Innovation begins where imagination meets execution.",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  const [modal, setModal] = useState({ active: false, index: 0 });
  const { scaleCursor, scaleRevertCursor } = useCursor();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(() => {
    gsap.to(".modalSection", {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: ".project-section",
        start: "bottom center",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  useGSAP(() => {
    if (!headingRef.current) return;

    const splitText = new SplitType(headingRef.current, { types: "chars" });

    gsap.from(splitText.chars, {
      opacity: 0,
      scale: 0.5,
      y: 20,
      stagger: 0.2,
      duration: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".heading",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;

    ScrollTrigger.create({
      trigger: headingRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      animation: gsap.to(headingRef.current, {
        y: "-20%",
        scale: 0.8,
        opacity: 0,
        ease: "power1.out",
      }),
    });
  }, []);

  useEffect(() => {
    if (!textRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(textRef.current, {
      opacity: 1,
      scale: 1.2, // Slight zoom-in effect
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }).to(textRef.current, {
      opacity: 0,
      scale: 0.8, // Shrink effect
      y: -30,
      duration: 0.5,
      ease: "power2.out",
      delay: 2,
      onComplete: () => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        gsap.fromTo(
          textRef.current,
          { scale: 1.5, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      },
    });

    return () => {
      tl.kill(); // Cleanup function correctly kills the timeline
    };
  }, [currentQuote]);

  return (
    <>
      <div className="overflow-hidden">
        <div className="overflow-hidden whitespace-nowrap w-full pb-20">
          <h1
            ref={headingRef}
            onMouseEnter={() => scaleCursor(8)}
            onMouseLeave={() => scaleRevertCursor()}
            className=" heading text-clamp-heading italic text-center"
          >
            Projects
          </h1>
          <h1
            ref={textRef}
            className="animated-text text-xs lg:text-xl text-center text-wrap text-gray-500"
          >
            {quotes[currentQuote]}
          </h1>
        </div>
        <div className="flex min-h-screen items-center justify-center relative ">
          <div className="project-section w-full flex flex-col items-center justify-center">
            {ProjectsFramer.map((project, index) => {
              return (
                <Project
                  index={index}
                  title={project.title}
                  setModal={setModal}
                  key={index}
                  className="modalSection"
                />
              );
            })}
          </div>
          <div className="modalSection fixed top-100 right-0 ">
            <Modal modal={modal} projects={ProjectsFramer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsFramer;
