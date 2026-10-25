"use client";

import React, { useEffect, useRef, useState } from "react";
import MapinlyImage from "@/public/assets/Images/mapinly.png";
import LernpiImage from "@/public/assets/Images/lernpi.png";
import FluxgenImage from "@/public/assets/Images/Fluxgen.png";
import ArmourImage from "@/public/assets/Images/armour.png";
import BountyDeskImage from "@/public/assets/Images/bountydesk.png";
import PoinuImage from "@/public/assets/Images/poinu.png";
import Project from "./ui/Project";
import dynamic from "next/dynamic";

// Hover preview needs a mouse; lazy so framer-motion stays off the critical path
const Modal = dynamic(() => import("./ui/Modal"), { ssr: false });
import { useCursor } from "./ui/Cursor";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ProjectsFramer = () => {
  const projects = [
    {
      title: "BountyDesk - Bug Bounty Triage",
      src: BountyDeskImage,
      color: "#0B0B0B",
      link: "https://bountydesk.vaibhav.quest/",
    },
    {
      title: "Poinu - Illustration Portfolio",
      src: PoinuImage,
      color: "#FFFFFF",
      link: "https://poinu.vercel.app/",
    },
    {
      title: "Armour AI finance app",
      src: ArmourImage,
      color: "#706D63",
      link: "https://armour.vaibhav.quest/",
    },
    {
      title: "Mapinly - Events & Community",
      src: MapinlyImage,
      color: "#706D63",
      link: "https://mapinly.vaibhav.quest/",
    },
    {
      title: "LernPI - School Management",
      src: LernpiImage,
      color: "#8C8C8C",
      link: "https://lernpi.ai/",
    },
    {
      title: "FluxGen - Water Intelligence",
      src: FluxgenImage,
      color: "#6F8FAF",
      link: "https://fluxgen.com/",
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
  // Mount the preview (framer-motion + screenshots) on the first hover over the list, not at page load
  const [hasHover, setHasHover] = useState(false);
  const firstPointer = useRef({ x: 0, y: 0 });
  const { scaleCursor, scaleRevertCursor } = useCursor();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

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

  // Original quote animation: pop in, hold, shrink out, next quote scales down into place
  // Only animate while the quote is on screen (no off-screen loop, and never caught mid-fade on load)
  const quoteTl = useRef<gsap.core.Timeline | null>(null);
  const quoteVisible = useRef(false);
  useEffect(() => {
    if (!textRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      quoteVisible.current = entry.isIntersecting;
      if (entry.isIntersecting) quoteTl.current?.play();
      else quoteTl.current?.pause();
    });
    io.observe(textRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!textRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({ repeat: -1, paused: !quoteVisible.current });
    quoteTl.current = tl;

    tl.to(textRef.current, {
      opacity: 1,
      scale: 1.2,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }).to(textRef.current, {
      opacity: 0,
      scale: 0.8,
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
      tl.kill();
    };
  }, [currentQuote]);

  return (
    <div className="container-x overflow-hidden pb-24 md:pb-32">
      <div className="w-full pb-10 lg:pb-16">
        <h2
          ref={headingRef}
          onMouseEnter={() => scaleCursor(8)}
          onMouseLeave={() => scaleRevertCursor()}
          className="heading text-clamp-heading italic text-center w-fit mx-auto"
        >
          Projects
        </h2>
        <p
          ref={textRef}
          className="animated-text text-xs sm:text-sm md:text-lg lg:text-xl text-center text-gray-600 max-w-[90%] md:max-w-[75%] lg:max-w-[50%] mx-auto"
        >
          {quotes[currentQuote]}
        </p>
      </div>
      <div
        className="flex flex-col items-center justify-center"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse" || hasHover) return;
          firstPointer.current = { x: e.pageX, y: e.pageY };
          setHasHover(true);
        }}
      >
        {projects.map((project, index) => (
          <Project
            index={index}
            title={project.title}
            setModal={setModal}
            key={project.link}
            link={project.link}
          />
        ))}
      </div>
      {hasHover && <Modal modal={modal} projects={projects} initialPointer={firstPointer.current} />}
    </div>
  );
};

export default ProjectsFramer;
