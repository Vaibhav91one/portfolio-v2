import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

type Project = {
  title: string;
  src: any; // Fix: Accept both URL and imported images
  color: string;
};

type ModalProps = {
  modal: {
    active: boolean;
    index: number;
  };
  projects: Project[];
};

const Modal: React.FC<ModalProps> = ({ modal, projects }) => {
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement | null>(null);

  const scaleAnimation = {
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
    if (!modalContainer.current) return;

    let xMoveContainer = gsap.quickTo(modalContainer.current, "left", {
      duration: 0.8,
      ease: "power3.out",
    });

    let yMoveContainer = gsap.quickTo(modalContainer.current, "top", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!modalContainer.current || !active) return;

      requestAnimationFrame(() => {
        const { width, height } =
          modalContainer.current!.getBoundingClientRect();
        xMoveContainer(e.clientX - width / 2);
        yMoveContainer(e.clientY - height / 2);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Depend on `active`


  return (
    <>
      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"} // Fix: Use "enter" instead of "open"
        className="h-[250px] w-[400px] sticky top-0 overflow-hidden flex items-center justify-center pointer-events-none"
      >
        <div
          style={{ top: `${index * -100}%` }}
          className="h-full w-full absolute transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        >
          {projects.map((project, i) => (
            <div
              key={`modal_${i}`}
              className="h-full w-full flex items-center justify-center"
              // style={{ backgroundColor: project.color }}
            >
              <Image
                src={project.src}
                width={500}
                height={500} // Fix: Set a proper height
                alt={project.title} // Fix: Improve accessibility
                className="h-auto pointer-events-none rounded-xl"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Modal;
