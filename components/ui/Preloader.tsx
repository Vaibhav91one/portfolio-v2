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
    // Disable scrolling
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
        // Re-enable scrolling after animation
        document.body.style.overflow = "";
      },
    });

    // Animate preloader opacity in
    tl.to(preloaderRef.current, { opacity: 1, duration: 0.5 });

    let delay = 0;

    messages.forEach((msg, i) => {
      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setIndex(i),
      })
        .to(textRef.current, { opacity: 1, duration: 0.5 })
        .delay(0.2);

      delay += 0.5;
    });

    // Final exit animation
    tl.to(preloaderRef.current, {
      y: "-100%",
      duration: 1,
      delay: 1,
      borderBottomLeftRadius: "50%",
      borderBottomRightRadius: "50%",
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
      // Cleanup: make sure scrolling is enabled if unmounted early
      document.body.style.overflow = "";
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
