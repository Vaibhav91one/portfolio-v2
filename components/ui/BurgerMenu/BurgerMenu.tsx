"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MenuLayer = dynamic(() => import("./MenuBar").then((m) => m.MenuLayer), { ssr: false });

export default function BurgerMenu() {
  const [isActive, setIsActive] = useState(false);
  const [opened, setOpened] = useState(false); // mount the lazy menu layer once, keep it for exit animations

  return (
    <>
      <button
        onClick={() => {
          setOpened(true);
          setIsActive(!isActive);
        }}
        aria-label={isActive ? "Close menu" : "Open menu"}
        aria-expanded={isActive}
        className="fixed right-0 m-5 z-50 w-16 h-16 rounded-full bg-gray-400 cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className={`relative w-full flex items-center justify-center`}>
          <span
            className={`absolute w-2/5 h-[1px] bg-white transition-transform duration-300 ${
              isActive ? "rotate-45" : "-translate-y-[5px]"
            }`}
          ></span>
          <span
            className={`absolute w-2/5 h-[1px] bg-white transition-transform duration-300 ${
              isActive ? "-rotate-45" : "translate-y-[5px]"
            }`}
          ></span>
        </div>
      </button>
      {opened && <MenuLayer isActive={isActive} setIsActive={setIsActive} />}
    </>
  );
}
