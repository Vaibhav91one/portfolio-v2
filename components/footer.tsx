"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Star from "./svgComponents/star";

const Spline = dynamic(() => import("./ui/SplineScene"), { ssr: false });

const contact = [
  { label: "vaibhavtomar3003@gmail.com", href: "mailto:vaibhavtomar3003@gmail.com" },
  { label: "+91 88946 77224", href: "tel:+918894677224" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Vaibhav91one" },
  { label: "X (Twitter)", href: "https://x.com/VrsatileVaibhav" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhavtomar91/" },
];

const linkCls =
  "group inline-flex items-center gap-1 py-1 text-lg transition-opacity duration-200 [@media(hover:hover)]:hover:opacity-60 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4";

const LinkList = ({ title, links, external }: { title: string; links: typeof contact; external?: boolean }) => (
  <div>
    <p className="mb-3 text-xs uppercase tracking-wider text-neutral-400">{title}</p>
    <ul className="flex flex-col">
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            className={linkCls}
            {...(external && { target: "_blank", rel: "me noopener noreferrer" })}
          >
            {l.label}
            {external && (
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 ease-snappy [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5"
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const footer = () => {
  const [showSpline, setShowSpline] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 3D scene, large screens only. The Spline runtime (~2 MB) freezes the main thread for a few hundred ms
  // while it boots, so never start it mid-scroll or during page load: start it once the visitor has
  // interacted and then paused for 800 ms, or right away if the footer comes into view first.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(min-width: 1024px)").matches) return;

    let pause: ReturnType<typeof setTimeout>;
    const mount = () => {
      setShowSpline(true);
      cleanup();
    };
    const onActivity = () => {
      clearTimeout(pause);
      pause = setTimeout(mount, 800);
    };
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && mount());
    const events = ["scroll", "pointermove", "keydown", "touchstart"] as const;
    const cleanup = () => {
      clearTimeout(pause);
      io.disconnect();
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };

    io.observe(root);
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return cleanup;
  }, []);

  // Curtain reveal: the clipped outer box scrolls in while the sticky panel stays pinned at the
  // viewport top. Outer, inner offset and panel all use the same 100vh, so nothing drifts.
  return (
    <div ref={rootRef} className="relative h-screen" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="relative h-[200vh] -top-[100vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-black text-white">
          {showSpline && (
            <div className="absolute -bottom-20 right-0 h-[85%] w-[55%]">
              <Spline scene="https://prod.spline.design/M4S11dvJnr65ej9S/scene.splinecode" />
            </div>
          )}

          <div className="container-x relative h-full pt-24 md:pt-32 pointer-events-none [&_a]:pointer-events-auto">
            <div className="max-w-xl">
              <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.95]">
                Let’s <Star /> work together
              </h2>
              <p className="mt-8 text-lg text-neutral-400">
                I take ideas from a rough sketch to a shipped product. I design it, build it and tune
                the motion myself. No handoff, no lost details. Design and code in one pair of hands.
              </p>
              {/* data-nosnippet: keeps the phone/email out of Google result snippets */}
              <div data-nosnippet className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-10">
                <LinkList title="Contact" links={contact} />
                <LinkList title="Socials" links={socials} external />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footer;
