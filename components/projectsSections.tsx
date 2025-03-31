"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image1 from "@/public/assets/Images/1082549.png";
import Image2 from "@/public/assets/Images/2008451.jpg";
import Image3 from "@/public/assets/Images/8921360.jpg";
import { useCursor } from "./ui/Cursor";
import SplitType from "split-type";
import { ArrowRight,Github} from "lucide-react";
import AnimatedParagraph from "./ui/AnimatedText";
import Button from "./ui/Button";

import { GreenSock } from "./svgComponents/greensock";
import { MongoDb } from "./svgComponents/mongodb";
import { NextJS } from "./svgComponents/nextjs";
import NodeJs from "./svgComponents/nodejs";
import { ReactJs } from "./svgComponents/react";
import { SocketIo } from "./svgComponents/socketio";
import { TailwindCss } from "./svgComponents/tailwindcss";
import ThreeJS from "./svgComponents/threejs";
import { TS } from "./svgComponents/typescript";
import { Redux } from "./svgComponents/redux";

gsap.registerPlugin(ScrollTrigger);

const content = [
  {
    title: "Zentry",
    description:
      "A robust authentication and access control system designed for secure and seamless user management.",
    image: Image1,
    techStack: [NextJS, TailwindCss], 
    features: [
      "OAuth & JWT authentication",
      "Role-based access control",
      "Multi-factor authentication",
    ],
    github: "https://github.com/yourusername/zentry",
  },
  {
    title: "Fizzi3D",
    description:
      "An interactive 3D modeling tool that allows users to create and manipulate objects in a browser-based environment.",
    image: Image2, // Update with correct image paths
    techStack: [ThreeJS, ReactJs],
    features: [
      "Drag & drop object manipulation",
      "Custom material & texture support",
      "Export models in various formats",
    ],
    github: "https://github.com/yourusername/fizzi3d",
  },
  {
    title: "Apple UI Clone",
    description:
      "A pixel-perfect recreation of Apple's UI, built with modern front-end technologies for a seamless experience.",
      image: Image3, // Update with correct image paths
    techStack: [ReactJs, TailwindCss],
    features: [
      "Smooth page transitions",
      "Fully responsive layout",
      "Dark mode support",
    ],
    github: "https://github.com/yourusername/apple-ui-clone",
  },
  {
    title: "NoteIt",
    description:
      "A minimalist note-taking app with real-time sync, markdown support, and cross-device accessibility.",
      image: Image1, // Update with correct image paths
    techStack: [NextJS],
    features: [
      "Live collaboration",
      "Markdown & rich text support",
      "Cloud sync across devices",
    ],
    github: "https://github.com/yourusername/noteit",
  },
  {
    title: "TrackWise",
    description:
      "A smart task and habit tracker designed to boost productivity through insightful analytics and reminders.",
      image: Image2, // Update with correct image paths
    techStack: [ReactJs, Redux, NodeJs, MongoDb],
    features: [
      "Task scheduling & reminders",
      "Progress tracking & analytics",
      "Customizable goal setting",
    ],
    github: "https://github.com/yourusername/trackwise",
  },
  {
    title: "Public Chat App",
    description:
      "A real-time chat application supporting global conversations with end-to-end encryption and user authentication.",
      image: Image3, // Update with correct image paths
    techStack: [NextJS, SocketIo],
    features: [
      "Real-time messaging",
      "End-to-end encryption",
      "User authentication & profile system",
    ],
    github: "https://github.com/yourusername/public-chat-app",
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

const projectsSections = () => {
  const { scaleCursor, scaleRevertCursor } = useCursor();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [currentQuote, setCurrentQuote] = useState(0);

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

  useGSAP(() => {
    const photos = gsap.utils.toArray(".desktopPhoto:not(:first-child)");
    const details = gsap.utils.toArray<HTMLElement>(
      ".desktopContentSection:not(:first-child)"
    );

    gsap.set(photos, { yPercent: 101 });

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".gallery",
        start: "top top",
        end: "bottom bottom",
        pin: ".right",
        scrub: true,
      });

      details.forEach((detail, index) => {
        let headline = detail.querySelector("h1");
        ScrollTrigger.create({
          trigger: headline,
          start: "top 80%",
          end: "top 50%",
          animation: gsap.to(photos[index]!, {
            yPercent: 0,
            ease: "power2.out",
            duration: 0.5,
          }),
          scrub: true,
        });
      });

      const sections = sectionsRef.current;

      // Animate each section individually
      sections.forEach((section, index) => {
        gsap.from(section, {
          opacity: 0,
          scale: 0.8, // Shrink effect
          y: -30,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            scrub: true,
          },
        });

        if (section) {
          gsap.from(section.querySelectorAll(".techIcon"), {
            opacity: 0,
            y: 20,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom center",
              scrub: true,
            },
          });

          gsap.from(section.querySelectorAll(".project-title"), {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.from(section.querySelectorAll(".project-btn"), {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
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
        // toggleActions: "play none none reverse",
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

  return (
    <>
      <div className="project-section flex justify-center flex-col items-center">
        <h1
          ref={headingRef}
          onMouseEnter={() => scaleCursor(8)}
          onMouseLeave={() => scaleRevertCursor()}
          className=" heading text-clamp-heading italic"
        >
          Projects
        </h1>
        <div className="overflow-hidden whitespace-nowrap w-full py-10">
          <h1
            ref={textRef}
            className="animated-text text-xs lg:text-xl text-center text-wrap text-gray-500"
          >
            {quotes[currentQuote]}
          </h1>
        </div>
      </div>
      <div className="gallery flex justify-between gap-10">
        {/* Left Content (Text) */}
        <div className="left hidden lg:block w-full lg:w-1/2 flex justify-center">
          <div className="desktopContent w-full">
            {content.map((item, index) => (
              <div
                ref={(el) => {
                  if (el) sectionsRef.current[index] = el; // Assign without returning anything
                }}
                key={index}
                className="desktopContentSection min-h-screen flex flex-col justify-center gap-10"
              >
                <div>
                  <h1 className="project-title text-4xl md:text-3xl font-bold flex justify-start items-center gap-2">
                    {item.title}
                  </h1>
                  <AnimatedParagraph description={item.description} />
                </div>
                <div className="flex justify-start items-center gap-10">
                {item.techStack.map((Icon, i) => (
                  <div key={i} className="w-[40px] h-[20px]  pb-7 techIcon"> 
                    <Icon width={10} height={10} /> 
                  </div>
            ))}
                </div>
                <div>
                  <a
                    href={item.github}
                    onMouseEnter={() => scaleCursor(0)}
                    onMouseLeave={() => scaleRevertCursor()}
                  >
                    <Button
                      className="project-btn"
                      preIcon={Github}
                      title="Github"
                      icon={ArrowRight}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content (Images) */}
        <div className="right h-auto lg:items-center w-full lg:w-1/2 lg:h-[100vh] flex flex-col justify-center relative">
          {/* Mobile Content */}
          <div className="mobileContent block w-full lg:hidden min-h-screen mb-10 pb-10">
            {content.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-5">
                <div className={`mobilePhoto w-[80vw] h-[70vw] mt-20 `}>
                  <Image src={item.image} alt="Image" className="rounded-2xl" />
                </div>
                <div>
                  <h1 className="project-title  text-2xl md:text-3xl font-bold flex justify-center items-center gap-2">
                    {item.title}
                  </h1>
                  <AnimatedParagraph description={item.description} />
                </div>
                <div className="flex justify-start items-center gap-10">
                {item.techStack.map((Icon, i) => (
                  <div key={i} className="w-[40px] h-[20px]  pb-7"> 
                    <Icon className="techIcon"  width={10} height={10} /> 
                  </div>
            ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Photos */}
          <div className="desktopPhotos w-[40vw] h-[20vw] rounded-3xl relative overflow-hidden hidden lg:block">
            {content.map((item, index) => (
              <div
                key={index}
                className={`desktopPhoto hidden lg:block absolute  w-full h-full`}
              >
                <Image src={item.image} alt="Image" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


export default projectsSections;
