'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from './anim';

export default function NavLink({ data, isActive, setSelectedIndicator } : any) {
  const { title, href, index } = data;

  return (
    <motion.div
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="relative flex items-center"
    >
      <motion.div
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
        className="w-2.5 h-2.5 bg-white rounded-full absolute -left-7"
      />
      <Link href={href} className="text-white font-light">
        {title}
      </Link>
    </motion.div>
  );
}
