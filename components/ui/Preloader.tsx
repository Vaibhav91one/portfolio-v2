"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  setLoading: (value: boolean) => void;
}

const Preloader: React.FC<PreloaderProps> = ({ setLoading }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

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
    // Repeat visit in this tab, or reduced motion: skip straight to the site
    let seen = false;
    try {
      seen = sessionStorage.getItem("seenPreloader") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoading(false);
      return;
    }

    // Disable scrolling
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("seenPreloader", "1");
        } catch {}
        setLoading(false);
        // Re-enable scrolling after animation
        document.body.style.overflow = "";
      },
    });

    // Continuous slide through every message
    const totalDuration = 5;
    const messageDuration = totalDuration / messages.length;

    gsap.set(messagesRef.current, { y: `${(messages.length - 1) * 80}px` });

    messages.forEach((_, i) => {
      tl.to(messagesRef.current, {
        y: `-${i * 80}px`,
        duration: messageDuration,
        ease: "power2.inOut",
      }, i * messageDuration);
    });

    // Exit: slide the panel up with the curved bottom edge
    tl.to(preloaderRef.current, {
      yPercent: -100,
      borderBottomLeftRadius: "50%",
      borderBottomRightRadius: "50%",
      duration: 1,
      delay: 0.3,
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
      data-preloader
      className="fixed inset-0 bg-black text-white"
      style={{ zIndex: 9999 }}
    >
      <div 
        ref={containerRef}
        className="absolute w-full overflow-hidden"
        style={{ 
          height: '80px', // Single message height
          bottom: '50%', // Position at center vertically
          transform: 'translateY(50%)', // Center it properly
        }}
      >
        <div 
          ref={messagesRef}
          className="relative"
          style={{ 
            height: `${messages.length * 80}px`, // Total height for all messages
            // Start where the timeline starts (list pushed below the window), so the server-rendered
            // first frame doesn't flash "Welcome" before it slides in
            transform: `translateY(${(messages.length - 1) * 80}px)`,
          }}
        >
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className="absolute flex h-20 w-full items-center justify-center text-3xl font-regular"
                style={{
                  top: `${index * 80}px`,
                  left: 0,
                  right: 0,
                  opacity: 1,
                  transform: 'scale(1)',
                }}
              >
                {message}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
