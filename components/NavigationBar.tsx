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

const navItems = [
  { label: "Work", id: "projects" },
  { label: "About", id: "about" },
  { label: "Contact", id: "footer" }, // assuming footer is your contact section
];

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
      <nav className="container-x hidden md:flex absolute z-10 inset-x-0 justify-between items-center text-xl my-5 text-white">
        {/* LEFT SIDE: Branding */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 uppercase leading-none tracking-tight">
            <AnimatedParagraph description="© Code By Vaibhav Tomar" />
          </div>
        </div>

        {/* RIGHT SIDE: Nav Links */}
        <ul className="flex flex-row items-center gap-10">
          {navItems.map((item, i) => (
            <li key={item.label} className="relative">
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                ref={(el) => {
                  linksRef.current[i] = el;
                }}
                style={{ perspective: "380px" }}
                className="relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="nav-text nav-text--bold uppercase leading-none tracking-tight">
                  {item.label}
                </span>
                <span className="nav-text nav-text--front absolute left-0 top-full uppercase leading-none tracking-tight opacity-0">
                  {item.label}
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
