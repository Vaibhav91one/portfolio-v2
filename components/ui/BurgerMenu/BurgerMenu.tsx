"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Menu from "./MenuBar";

export default function BurgerMenu() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsActive(!isActive)}
        className="fixed right-0 m-5 z-50 w-20 h-20 rounded-full bg-gray-400 cursor-pointer flex items-center justify-center"
      >
        <div className={`relative w-full flex items-center justify-center`}>
          <span
            className={`absolute w-2/5 h-[1px] bg-white transition-transform duration-300 ${
              isActive ? "rotate-45 top-[2px]" : "-top-[5px]"
            }`}
          ></span>
          <span
            className={`absolute w-2/5 h-[1px] bg-white transition-transform duration-300 ${
              isActive ? "-rotate-45 top-[2px]" : "top-[5px]"
            }`}
          ></span>
        </div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Menu setIsActive={setIsActive} />}</AnimatePresence>
    </>
  );
}
