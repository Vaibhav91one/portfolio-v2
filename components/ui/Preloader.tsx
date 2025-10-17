"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  setLoading: (value: boolean) => void;
}

const Preloader: React.FC<PreloaderProps> = ({ setLoading }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    tl.to(preloaderRef.current, { opacity: 1, duration: 0.3 });

    // Create smooth continuous sliding animation from bottom
    const totalDuration = 5; // Total duration for all messages
    const messageDuration = totalDuration / messages.length;

    // Start with the container positioned to show the first message at the bottom
    gsap.set(messagesRef.current, { y: `${(messages.length - 1) * 80}px` });

    messages.forEach((_, i) => {
      // Set the current message index
      tl.call(() => setCurrentIndex(i), [], i * messageDuration);
      
      // Smooth continuous sliding animation from bottom to top
      tl.to(messagesRef.current, {
        y: `-${i * 80}px`, // Move up by 80px for each message
        duration: messageDuration,
        ease: "power2.inOut", // Smooth, no springy effect
      }, i * messageDuration);
    });

    // Final exit animation - reduced delay
    tl.to(preloaderRef.current, {
      y: "-100%",
      duration: 1,
      delay: 0.3, // Reduced delay
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
      className="fixed inset-0 bg-black text-white opacity-0"
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
            transform: 'translateY(0%)' // This will be animated
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
