"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import ProfilePicture from "../public/assets/Images/portfolio.png";
import Magnetic from "./ui/Magnetic";
import dynamic from "next/dynamic";
import type { Paint } from "./ui/Displacement";

// WebGL effect is cursor-driven: load its code only on mouse devices, after the photos are in
const Displacement = dynamic(() => import("./ui/Displacement"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false); // Ensure animation runs only once
  const slider = useRef(null);
  const track = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const photosRef = useRef<HTMLDivElement | null>(null);
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [fxReady, setFxReady] = useState(false);

  // The displacement canvas copies the photos' on-screen boxes, so only start it once they have loaded:
  // before that the <img> is laid out as a 550x550 square and the copy lands in the wrong place.
  useEffect(() => {
    const imgs = [...(photosRef.current?.querySelectorAll("img") ?? [])];
    const loaded = (img: HTMLImageElement) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
    let cancelled = false;
    const bg = bgRef.current;
    if (!bg || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    // Start the WebGL effect on the first pointer move over the hero (it only reacts to the cursor anyway),
    // so none of its setup runs during page load.
    const start = () =>
      Promise.all(imgs.map((img) => loaded(img).then(() => img.decode().catch(() => {})))).then(() => {
        if (!cancelled) setPhotosLoaded(true);
      });
    bg.addEventListener("pointermove", start, { once: true, passive: true });
    return () => {
      cancelled = true;
      bg.removeEventListener("pointermove", start);
    };
  }, []);

  // Name marquee: one track holding 3 copies, moved in px/s on GSAP's ticker (frame-rate independent),
  // wrapped by exactly one copy width so it never runs out of text. Scroll direction flips it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !track.current) return;
    const el = track.current;
    const SPEED = 80; // px per second
    const setX = gsap.quickSetter(el, "x", "px");
    let copyWidth = (el.children[0] as HTMLElement).offsetWidth;
    let x = 0;
    let direction = -1;

    const tween = gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: "-500px",
    });

    const tick = (_time: number, deltaTime: number) => {
      x += (direction * SPEED * deltaTime) / 1000;
      if (x <= -copyWidth) x += copyWidth;
      else if (x > 0) x -= copyWidth;
      setX(x);
    };
    const onResize = () => (copyWidth = (el.children[0] as HTMLElement).offsetWidth);

    // Only run the marquee while the hero is on screen
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? gsap.ticker.add(tick) : gsap.ticker.remove(tick),
    );
    io.observe(el);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useGSAP(() => {
    if (heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.to(heroRef.current, {
          y: "-20%",
          // opacity: 0,
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

  // Redraw the gray backdrop + photo (where the DOM lays it out) into the displacement canvas
  const paintHero: Paint = (ctx, width, height) => {
    const bg = bgRef.current;
    const photos = photosRef.current;
    if (!bg || !photos) return;
    const box = bg.getBoundingClientRect();
    ctx.fillStyle = getComputedStyle(bg).backgroundColor;
    ctx.fillRect(0, 0, width, height);
    const imgs = [...photos.querySelectorAll("img")].filter((img) => img.offsetParent !== null && img.naturalWidth > 0);
    for (const img of imgs) {
      const r = img.getBoundingClientRect();
      ctx.drawImage(img, r.left - box.left, r.top - box.top, r.width, r.height);
    }
  };

  return (
    <>
      <div ref={heroRef} className="relative will-change-transform">
        <h1 className="sr-only">Vaibhav Tomar — Design Engineer and Software Developer</h1>
        {/* <NavigationBar/> */}
        <div ref={bgRef} className="relative flex justify-center max-h-[100vh] h-[100vh] items-center overflow-hidden bg-gray-500">
          <div
            ref={photosRef}
            className={`flex self-center justify-center items-center pointer-events-none ${fxReady ? "invisible" : ""}`}
          >
            <Image
              src={ProfilePicture}
              alt="Vaibhav Tomar"
              priority
              fetchPriority="high"
              width={1792}
              height={1008}
              sizes="(max-width: 1024px) 180vh, 1600px"
              quality={70}
              className="h-[100vh] w-auto max-w-none shrink-0"
            />
          </div>
          {photosLoaded && (
            <Displacement
              paint={paintHero}
              onReady={() => setFxReady(true)}
              grid={40}
              threshold={300}
              strength={0.15}
              scramble={0}
            />
          )}
          <div
            className="title absolute font-regular right-5 lg:right-20 flex justify-center items-end lg:items-start bottom-2 lg:bottom-auto
         flex-col text-lg lg:text-2xl gap-2"
          >
            <p className=" text-white">Design Engineer</p>
              <p className=" text-white">Software Developer</p>
              <p className=" text-white">Cybersecurity Researcher</p>
              <p className=" text-white">Freelancer</p>
          </div>

          <div
            className="title absolute bottom-0 lg:bottom-auto left-0 rounded-l-md rounded-r-full flex justify-center items-center
          text-xl lg:text-2xl gap-12 bg-none lg:bg-black p-5"
          >
            <p className="text-white hidden lg:block whitespace-nowrap">
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
        <div className="absolute top-screen-minus-350 left-0 pointer-events-none">
          <div ref={slider}>
            <div ref={track} className="flex w-max will-change-transform">
              {[0, 1, 2].map((i) => (
                <p
                  key={i}
                  aria-hidden={i > 0}
                  className="m-0 shrink-0 whitespace-nowrap pr-[50px] text-[100px] font-medium text-white lg:text-[200px]"
                >
                  Vaibhav Tomar -
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
