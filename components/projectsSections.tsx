"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image1 from "@/assets/Images/1082549.png";
import Image2 from "@/assets/Images/2008451.jpg";
import Image3 from "@/assets/Images/8921360.jpg";
import { useCursor } from "./ui/Cursor";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const quotes = [
  "Creativity is intelligence having fun. — Albert Einstein",
  "Make it simple, but significant. — Don Draper",
  "Design is thinking made visual. — Saul Bass",
  "Creativity takes courage. — Henri Matisse",
  "Your work is your signature. Make it legendary.",
  "Dream big. Create bigger.",
  "Innovation begins where imagination meets execution.",
  "Great things are done by a series of small things brought together. — Van Gogh",
];

const projectsSections = () => {
  const { scaleCursor, scaleRevertCursor } = useCursor();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(textRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.out",
        delay: 2,
      })
      .call(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      });

    return () => {
      tl.kill(); // Cleanup GSAP animation properly
    };
  }, [currentQuote]); // Dependency ensures re-run when quote changes

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
      });

      details.forEach((detail, index) => {
        let headline = detail.querySelector("h1");
        ScrollTrigger.create({
          trigger: headline,
          start: "top 80%",
          end: "top 50%",
          animation: gsap.to(photos[index]!, { yPercent: 0 }),
          scrub: true,
          markers: false,
        });
      });
    });
  }, []);

  useGSAP(() => {
    if (!headingRef.current) return;

    const splitText = new SplitType(headingRef.current, { types: "chars" });

    gsap.fromTo(
      splitText.chars,
      { opacity: 0,
        duration: 0.2,
        y: 50,
        stagger: 0.2 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".heading",
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <h1
          ref={headingRef}
          onMouseEnter={() => scaleCursor(8)}
          onMouseLeave={() => scaleRevertCursor()}
          className=" heading text-9xl italic"
        >
          Projects
        </h1>
        <div className="overflow-hidden whitespace-nowrap w-full py-10">
          <h1 ref={textRef} className="animated-text text-2xl text-center text-gray-500">
            {quotes[currentQuote]}
          </h1>
        </div>
      </div>
      <div className="gallery flex">
        {/* Left Content (Text) */}
        <div className="left hidden lg:block w-full lg:w-1/2 flex justify-center">
          <div className="desktopContent w-[80%]">
            {content.map((item, index) => (
              <div
                key={index}
                className="desktopContentSection min-h-screen flex flex-col justify-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold">{item.title}</h1>
                <p className="text-lg md:text-2xl leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content (Images) */}
        <div className="right h-auto lg:items-center w-full lg:w-1/2 lg:h-[100vh] flex flex-col justify-center relative">
          {/* Mobile Content */}
          <div className="mobileContent block w-full lg:hidden">
            {content.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`mobilePhoto w-[80vw] h-[80vw] mt-20 rounded-[6vw] ${item.color}`}
                ></div>
                <h1 className="text-3xl font-bold mt-4">{item.title}</h1>
                <p className="text-lg text-center">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Photos */}
          <div className="desktopPhotos w-[40vw] h-[20vw] rounded-2xl relative overflow-hidden hidden lg:block">
            {content.map((item, index) => (
              <div
                key={index}
                className={`desktopPhoto hidden lg:block absolute inset-0 w-full h-full`}
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

const content = [
  {
    title: "Zentry",
    description:
      "Red is a color often associated with strong emotions such as passion, love, and anger...Red is a color often associated with strong emotions such as passion, love, and anger...Red is a color often associated with strong emotions such as passion, love, and anger...",
    color: "bg-red-500",
    image: Image1,
  },
  {
    title: "Fizzi3d",
    description:
      "Green is a color that is often associated with nature, growth, and harmony...",
    image: Image2,
    color: "bg-green-500",
  },
  {
    title: "Apple UI Clone",
    description:
      "Pink is a color that is often associated with femininity, romance, and sweetness...",
    image: Image3,
    color: "bg-pink-500",
  },
  {
    title: "NoteIt",
    description:
      "Pink is a color that is often associated with femininity, romance, and sweetness...",
    image: Image3,
    color: "bg-pink-500",
  },
  {
    title: "TrackWise",
    description:
      "Pink is a color that is often associated with femininity, romance, and sweetness...",
    image: Image3,
    color: "bg-pink-500",
  },
  {
    title: "Public Chat App",
    description:
      "Pink is a color that is often associated with femininity, romance, and sweetness...",
    image: Image3,
    color: "bg-pink-500",
  },
];

export default projectsSections;
