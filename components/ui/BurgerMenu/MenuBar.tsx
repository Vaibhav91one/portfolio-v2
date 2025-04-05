'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from './anim'; // ✅ Keep this if you're using custom animations
import Link from './Link'; // ✅ Assuming this is a custom link component with animation support

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Work', href: '/work' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

export default function Menu() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed top-0 right-0 w-full h-screen bg-neutral-900 text-white z-50"
    >
      <div className="flex flex-col justify-between h-full box-border p-24">
        <div
          className="flex flex-col text-[56px] gap-3 mt-20"
          onMouseLeave={() => setSelectedIndicator(pathname)}
        >
          <div className="uppercase text-xs text-neutral-400 border-b border-neutral-500 mb-10">
            Navigation
          </div>
          {navItems.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>

        <div className="flex justify-between text-xs gap-10">
          <a href="#">Awwwards</a>
          <a href="#">Instagram</a>
          <a href="#">Dribbble</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </motion.div>
  );
}
