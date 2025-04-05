"use client";

import React, { useEffect, useRef } from "react";
import Magnetic from "./ui/Magnetic";
import BurgerMenu from "./ui/BurgerMenu/BurgerMenu";
import gsap from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { useCursor } from "./ui/Cursor";
import AnimatedParagraph from "./ui/AnimatedText";

type Props = {};

const navItems = ["Work", "About", "Contact"];

const NavigationBar = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scaleCursor, scaleRevertCursor } = useCursor();

  const linksRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    linksRef.current.forEach((navLink) => {
      if (!navLink) return;

      const boldText = navLink.querySelector(".nav-text--bold");
      const frontText = navLink.querySelector(".nav-text--front");

      if (!boldText || !frontText) return;

      const tl = gsap.timeline({ ease: "none", paused: true });

      gsap.set(frontText, {
        rotationX: -90,
        yPercent: -25,
        opacity: 0,
      });

      tl.to(boldText, {
        yPercent: -50,
        rotationX: 90,
      })
        .to(
          frontText,
          {
            yPercent: -100,
            rotationX: 0,
            opacity: 1,
          },
          0
        )
        .to(
          boldText,
          {
            opacity: 0,
            duration: 0.15,
          },
          0.2
        );

      navLink.addEventListener("mouseenter", () => tl.play());
      navLink.addEventListener("mouseleave", () => tl.reverse());
      navLink.addEventListener("focus", () => tl.play());
      navLink.addEventListener("blur", () => tl.reverse());
    });
  }, []);

  return (
    <>
<nav className="hidden md:flex absolute z-10 w-full justify-between items-center text-xl my-5 px-5 text-white">
  {/* LEFT SIDE: Branding */}
  <div className="flex items-center">
    <div className="flex items-center gap-2 -mt-3 ml-2 uppercase leading-none tracking-tight">
      <AnimatedParagraph description="© Code By Vaibhav Tomar" />
    </div>
  </div>

  {/* RIGHT SIDE: Nav Links */}
  <ul className="flex flex-row items-center gap-10">
    {navItems.map((item, i) => (
      <li key={item} className="relative mt-2">
        <a
          href="#"
          ref={(el) => {
            linksRef.current[i] = el;
          }}
          style={{ perspective: '380px' }}
          className="flex flex-col items-center outline-none focus:outline-none"
        >
          <span className="nav-text nav-text--bold uppercase leading-none tracking-tight">
            {item}
          </span>
          <span className="nav-text nav-text--front uppercase leading-none tracking-tight text-black opacity-0">
            {item}
          </span>
        </a>
      </li>
    ))}
  </ul>

  
</nav>


      <div className="md:hidden block absolute top-0">
        <BurgerMenu />
      </div>
    </>
  );
};

export default NavigationBar;
