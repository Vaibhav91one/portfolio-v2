"use client";

import React, { useEffect, useRef } from "react";
import { ArrowDown, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import ProfilePicture from "../public/assets/Images/no Bg.png";
import Magnetic from "./ui/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false); // Ensure animation runs only once
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
        trigger: ".title",
        start: "bottom center",
        scrub: 1,
        animation: gsap.to(".title", { y: "-20%" }),
      });
    }
  });
  const imageRef = useRef(null);
  const secondImageRef = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10; // tweak the multiplier for more/less movement
      const y = (e.clientY / innerHeight - 0.5) * 10;

      gsap.to(imageRef.current, {
        x,
        duration: 0.5,
        ease: "power3.out"
      });

      gsap.to(secondImageRef.current, {
        x: -x , // opposite and smaller
        // y: -y * 0.5,
        duration: 0.7,
        ease: "power3.out"
      });

    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div ref={heroRef} className="relative">
        {/* <NavigationBar/> */}
        <div className="relative flex justify-center max-h-[100vh] h-[100vh] items-center overflow-hidden bg-gray-500">
          <div className="flex justify-center items-center">
            <Image
              src={ProfilePicture}
              ref={imageRef}
              alt="Your Photo"
              width={550}
              height={550}
              className="object-cover grayscale"
            />
            <Image
              src={ProfilePicture}
              alt="Your Photo"
              ref={secondImageRef}
              width={550}
              height={550}
              className="hidden lg:block object-cover grayscale transform rotate-180 mix-blend-luminosity"
            />
          </div>
          <div
            className="title absolute font-regular right-10 lg:right-20 flex justify-center items-end bottom-10 lg:bottom-auto
         flex-col text-xl gap-2"
          >
            <Magnetic>
              <p className=" text-white">Software Developer</p>
            </Magnetic>
            <Magnetic>
              <p className=" text-white">Cybersecurity</p>
            </Magnetic>
            <Magnetic>
              <p className=" text-white">Freelancer</p>
            </Magnetic>

          </div>

          <div
            className="title absolute bottom-0 lg:bottom-auto left-0 rounded-l-md rounded-r-full flex justify-center items-center
          text-xl lg:text-2xl gap-12 bg-none lg:bg-black p-5"
          >
            <p className="text-white hidden lg:block lg:w-30">
              Located in India
            </p>

            <div className="bg-gray-400 rounded-full">
              <Globe
                className="text-white rounded-full m-4 animate-rotate-slow"
                size={30}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-screen-minus-350">
          <div ref={slider} className="relative whitespace-nowrap">
            <p
              ref={firstText}
              className="text-[100px] relative m-0 text-white lg:text-[200px] font-medium pr-[50px]"
            >
              Vaibhav Tomar -
            </p>

            <p
              ref={secondText}
              className="text-[100px] absolute left-[100%] top-0 m-0 text-white lg:text-[200px] font-medium pr-[50px]"
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
