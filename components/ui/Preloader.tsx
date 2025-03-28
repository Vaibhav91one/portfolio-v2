"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  setLoading: (value: boolean) => void;
}

const Preloader: React.FC<PreloaderProps> = ({ setLoading }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [index, setIndex] = useState(0);

  // Array of "Welcome" in different languages
  const messages = [
    "Welcome", // English
    "Bienvenido", // Spanish
    "Bienvenue", // French
    "Willkommen", // German
    "Benvenuto", // Italia
    "欢迎", // Chinese
    "ようこそ", // Japanese
    "환영합니다", // Korean
    "مرحبا", // Arabic
    "स्वागत है", // Hindi 
];

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setLoading(false), // Hide preloader after animation
    });

    // Animate preloader opacity in
    tl.to(preloaderRef.current, { opacity: 1, duration: 0.5 });

    let delay = 0;

    // Loop through each message and animate
    messages.forEach((msg, i) => {
      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setIndex(i), // Change text after fade-out
      })
        .to(textRef.current, { opacity: 1, duration: 0.5 })
        .delay(1); // Wait before changing text
      delay += 1.5; // Delay for next text
    });

    // Fade out preloader after all messages
    tl.to(preloaderRef.current, { opacity: 0, duration: 1, delay: 1 });

    return () => {
      tl.kill(); // Cleanup animation
    };
  }, [setLoading]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 flex items-center justify-center bg-black text-white z-50 opacity-0"
    >
      <h1 ref={textRef} className="text-3xl opacity-0">
        {messages[index]}
      </h1>
    </div>
  );
};

export default Preloader;
