'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RippleImage = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;

    if (!wrapper || !turbulence || !displacement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',     // Start anim when wrapper enters viewport
        end: 'bottom top',       // End when it's scrolled past
        scrub: true,             // Key: makes scroll tie to timeline!
      },
    });

    tl.to(turbulence, {
      attr: { baseFrequency: 0.03 },
      ease: 'none',
    }).to(displacement, {
      attr: { scale: 50 },
      ease: 'none',
    }, 0); // Parallel with turbulence

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-[550px] h-[550px] hidden lg:block overflow-hidden"
      style={{ filter: 'url(#rippleFilter)' }}
    >
      <h2>Vaibhav Tomar</h2>

      {/* SVG Filter for Ripple */}
      <svg className="absolute w-0 h-0">
        <filter id="rippleFilter">
          <feTurbulence
            ref={turbulenceRef}
            type="turbulence"
            baseFrequency="0.0001"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="turbulence"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
};

export default RippleImage;
