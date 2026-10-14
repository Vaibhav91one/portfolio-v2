import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import gsap from "gsap";

type Project = {
  title: string;
  src: any;
  color: string;
};

type ModalProps = {
  modal: {
    active: boolean;
    index: number;
  };
  projects: Project[];
  /** Where the pointer was when the modal mounted, so the preview starts under it instead of flying in from (0,0). */
  initialPointer?: { x: number; y: number };
};

const Modal: React.FC<ModalProps> = ({ modal, projects, initialPointer }) => {
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement | null>(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  // Original motion (391d3dc): scale from 0, 0.4s in/out
  const scaleAnimation: Variants = {
    initial: { scale: 0 },
    enter: {
      scale: 1,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      scale: 0,
      transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
    },
  };

  useEffect(() => {
    const els = [modalContainer.current, cursor.current, cursorLabel.current];
    const durations = [0.8, 0.5, 0.45];
    // centre each box on the pointer; x/y stay on the GPU (left/top forced layout)
    gsap.set(els, { xPercent: -50, yPercent: -50, left: 0, top: 0, x: initialPointer?.x ?? 0, y: initialPointer?.y ?? 0 });
    const movers = els.map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: durations[i], ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: durations[i], ease: "power3" }),
    }));

    const onMove = (e: MouseEvent) => {
      movers.forEach((m) => {
        m.x(e.pageX);
        m.y(e.pageY);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const anim = { variants: scaleAnimation, initial: "initial", animate: active ? "enter" : "closed" };

  // outer div = GSAP pointer follow (x/y), inner motion.div = framer scale; split so the two never fight over `transform`
  return (
    <>
      <div
        ref={modalContainer}
        className="absolute z-10 pointer-events-none w-[50vw] md:w-[400px] h-[50vh] sm:h-[60vh] md:h-[350px]"
      >
        <motion.div {...anim} className="h-full w-full overflow-hidden relative">
          <div
            style={{ transform: `translateY(${index * -100}%)` }}
            className="h-full w-full absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          >
            {projects.map((project, i) => (
              <div
                key={`modal_${i}`}
                className="h-full w-full flex items-center justify-center"
                style={{ backgroundColor: project.color }}
              >
                <Image
                  src={project.src}
                  sizes="400px"
                  alt=""
                  className="h-auto max-w-full object-contain pointer-events-none"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div ref={cursor} className="absolute z-10 w-10 h-10 sm:w-20 sm:h-20 pointer-events-none">
        <motion.div {...anim} className="h-full w-full rounded-full bg-[#455CE9]" />
      </div>

      <div ref={cursorLabel} className="absolute z-10 w-10 h-10 sm:w-20 sm:h-20 pointer-events-none">
        <motion.div
          {...anim}
          className="h-full w-full flex items-center justify-center text-white text-xs sm:text-sm font-light"
        >
          View
        </motion.div>
      </div>
    </>
  );
};

export default Modal;
