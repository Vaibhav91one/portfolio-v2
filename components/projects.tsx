"use client";

import React, { useEffect, useRef, useState } from "react";
import MapinlyImage from "@/public/assets/Images/mapinly.png";
import LernpiImage from "@/public/assets/Images/lernpi.png";
import FluxgenImage from "@/public/assets/Images/Fluxgen.png";
import FizziImage from "@/public/assets/Images/fizzi.png";
import AppleImage from "@/public/assets/Images/apple.png";
import ArmourImage from "@/public/assets/Images/armour.png";
import ZentryImage from "@/public/assets/Images/zentry.png";
import TrackWiseImage from "@/public/assets/Images/track.jpg";
import Project from "./ui/Project";
import Modal from "./ui/Modal";
import { useCursor } from "./ui/Cursor";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import Button from "./ui/Button";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ProjectsFramer = () => {
  const projects = [
    {
      title: "Armour AI finance app",
      src: ArmourImage,
      color: "#706D63",
      link: "https://yb-black.vercel.app/",
    },
    {
      title: "Mapinly - Events & Community",
      src: MapinlyImage,
      color: "#706D63",
      link: "https://map-inly-2-0.vercel.app/",
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
    {
      title: "Fizzi 3D",
      src: FizziImage,
      color: "#000000",
      link: "https://fizzi3d-eight.vercel.app/",
    },
    {
      title: "Apple UI Clone",
      src: AppleImage,
      color: "#8C8C8C",
      link: "https://three-js-gsap-project.vercel.app/",
    },
    {
      title: "WebScraping application",
      src: TrackWiseImage,
      color: "#EFE8D3",
      link: "https://track-wise-beryl.vercel.app/",
    },
    {
      title: "Zentry",
      src: ZentryImage,
      color: "#706D63",
      link: "https://zentry-gules.vercel.app/",
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
    if (!textRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

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
    <div className="overflow-hidden min-h-screen">
      <div className="w-full pb-10 sm:pb-16 lg:pb-20">
        <h1
          ref={headingRef}
          onMouseEnter={() => scaleCursor(8)}
          onMouseLeave={() => scaleRevertCursor()}
          className="heading text-clamp-heading italic text-center"
        >
          Projects
        </h1>
        <h1
          ref={textRef}
          className="animated-text text-xs sm:text-sm md:text-lg lg:text-xl text-center text-gray-500 max-w-[90%] md:max-w-[75%] lg:max-w-[50%] mx-auto"
        >
          {quotes[currentQuote]}
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6">
        {projects.map((project, index) => (
          <Project
            index={index}
            title={project.title}
            setModal={setModal}
            key={index}
            link={project.link}
          />
        ))}
        <a href="https://github.com/Vaibhav91one" target="_blank">
          <Button
            className="main-btn"
            title="SEE MORE PROJECTS"
            icon={ArrowRight}
          />
        </a>
      </div>
      <Modal modal={modal} projects={projects} />
    </div>
  );
};

export default ProjectsFramer;
