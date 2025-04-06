import { motion } from "framer-motion";
import NavLink from "./Link";
import { menuSlide } from "./anim";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Magnetic from "../Magnetic";
import { Github, Linkedin } from "lucide-react";
import TwitterIcon from "@/components/svgComponents/Twitter";


export default function Menu({ setIsActive }: { setIsActive: (active: boolean) => void }) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(`#projects`); // or whatever default

  const navItems = [
    { label: "Work", id: "projects" },
    { label: "About", id: "about" },
    { label: "Contact", id: "footer" },
  ];

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed top-0 right-0 h-screen w-full bg-neutral-900 text-white z-40"
    >
      <div className="flex flex-col justify-between h-full box-border p-24">
        <div
          className="flex flex-col text-[56px] gap-3 mt-20"
          onMouseLeave={() => setSelectedIndicator(`#projects`)} // or current section
        >
          <div className="uppercase text-xs text-neutral-400 border-b border-neutral-500 mb-10">
            Navigation
          </div>
          {navItems.map((data, index) => (
            <NavLink
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === `#${data.id}`}
              setSelectedIndicator={setSelectedIndicator}
              setIsActive={setIsActive}
            />
          ))}
        </div>

        <div className="flex text-xs gap-2">
        <Magnetic>
                  <a
                    href="https://github.com/Vaibhav91one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 p-5 rounded-full transition-colors"
                  >
                    <Github size={18} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://x.com/VrsatileVaibhav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 p-5 rounded-full transition-colors"
                  >
                    {/* <Twitter size={30} />
                    <X/> */}
                    <TwitterIcon size={18} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://www.linkedin.com/in/vaibhav-tomar-a6b2b6255/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 p-5 rounded-full transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                </Magnetic>
        </div>
      </div>
    </motion.div>
  );
}
