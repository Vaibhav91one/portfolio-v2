"use client";

import React, { forwardRef, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import gsap from "gsap";

type Props = {
  title: string;
  icon?: LucideIcon;
  preIcon?: LucideIcon;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ title, icon: Icon, preIcon: PreIcon,  className, ...props }, ref) => {
    const handleMouseEnter = () => {
      gsap.to(".anim", {
        left: "0%", // Moves background to cover the button
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(".text", {
        color: "#fff", // Change text color to white
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(".anim", {
        left: "100%", // Moves background back out the same way it entered
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".anim", { left: "-100%" });
        },
      });

      gsap.to(".text", {
        color: "#000", // Change text color back to black
        ease: "power2.out",
      });
    };

    return (
      <button
        id="btn"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={` relative flex items-center gap-2 rounded-full border-1 overflow-hidden px-6 py-3 text-nowrap ${className}`}
        {...props}
      >
        {PreIcon && <PreIcon className="text" size={20} />}
        <div className=" anim absolute top-0 left-[-100%] w-full h-full bg-[#000000]  -z-10"></div>
        <span className="text-[13px] font-semibold text text-black">{title}</span>
        {Icon && <Icon className="text" size={20} />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
