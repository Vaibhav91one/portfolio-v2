"use client";

import React, { useRef } from "react";
import { LucideIcon } from "lucide-react";
import gsap from "gsap";

type Props = {
  title: string;
  icon?: LucideIcon;
  preIcon?: LucideIcon;
  className?: string;
  href?: string;
  target?: string;
};

// Original hover (391d3dc): black fill slides in from the left, exits out to the right, then resets.
// Scoped to this button's own refs (the original targeted every `.anim` on the page).
const Button = ({ title, icon: Icon, preIcon: PreIcon, className, href, target }: Props) => {
  const fill = useRef<HTMLSpanElement>(null);
  const content = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.to(fill.current, { xPercent: 100, duration: 0.4, ease: "power2.out" });
    gsap.to(content.current, { color: "#fff", duration: 0.4, ease: "power2.out" });
  };
  const onLeave = () => {
    gsap.to(fill.current, {
      xPercent: 200,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(fill.current, { xPercent: 0 });
      },
    });
    gsap.to(content.current, { color: "#000", ease: "power2.out" });
  };

  const cls = `relative isolate flex items-center gap-2 rounded-full border-1 overflow-hidden px-6 py-3 text-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`;
  const inner = (
    <>
      {/* starts one width to the left (-100%); xPercent 100 = covering, 200 = gone right */}
      <span ref={fill} className="absolute top-0 -left-full h-full w-full bg-black -z-10" />
      <span ref={content} className="flex items-center gap-2 text-black">
        {PreIcon && <PreIcon size={20} />}
        <span className="text-[13px] font-semibold">{title}</span>
        {Icon && <Icon size={20} />}
      </span>
    </>
  );

  return href ? (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <button onMouseEnter={onEnter} onMouseLeave={onLeave} className={cls}>
      {inner}
    </button>
  );
};

export default Button;
