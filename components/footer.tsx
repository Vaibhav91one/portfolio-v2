"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Magnetic from "./ui/Magnetic";
import { Github, Twitter, Linkedin, Clock, X } from "lucide-react";
import Spline from "@splinetool/react-spline";
import TwitterIcon from "./svgComponents/Twitter";
import Star from "./svgComponents/star";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const footer = (props: Props) => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const version = "v1.0.0"; // Change this as needed

  return (
    <div
      className="relative h-[80vh] min-h-[100vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+80vh)] bottom-[80vh]">
        <div className="bg-black text-white px-12 h-full w-full flex flex-col justify-between">
          <div className="h-[85vh] sticky top-[calc(100vh-80vh)]">
            <div className="relative lg:mx-120 grid grid-cols-1 grid-rows-1 gap-4">
              <div className="mix-blend-hue">
                <div className="flex justify-center flex-col items-center gap-10">
                  <div className="w-full border-b-2">
                    <h1 className="text-center text-[5vw] leading-[0.8] mb-10">
                       Let’s <Star/> work together
                    </h1>
                  </div>
                  <div className="flex justify-center flex-col lg:flex-row items-center gap-10">
                    <Magnetic>
                      <button className="p-4 border-3 hover:border-0 rounded-full transition-colors duration-200 hover:bg-white hover:text-black ">
                        vaibhavtomar3003@gmail.com
                      </button>
                    </Magnetic>
                    <Magnetic>
                      <button className="p-4 border-3 hover:border-0 rounded-full transition-colors duration-200 hover:bg-white hover:text-black ">
                        +918894677224
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </div>
            <footer className="w-full text-white absolute bottom-0 left-0 bg-opacity-70 p-4 flex flex-col sm:flex-row items-center justify-between z-50 gap-5 text-sm">
              {/* Socials */}
              <div className="flex gap-2 items-center">
                <Magnetic>
                  <a
                    href="https://github.com/Vaibhav91one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 p-5 rounded-full transition-colors"
                  >
                    <Github size={30} />
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
                    <TwitterIcon/>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://www.linkedin.com/in/vaibhav-tomar-a6b2b6255/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 p-5 rounded-full transition-colors"
                  >
                    <Linkedin size={30} />
                  </a>
                </Magnetic>
              </div>

              {/* Live Clock */}
             

              {/* Version */}
              <div className="flex items-center justify-center gap-12 italic text-lg mt-2 sm:mt-0">
                {version}
                <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{time}</span>
              </div>
              </div>
            </footer>
            {/* <div className="absolute top-0 z-[-99] opacity-0 lg:opacity-50 pointer-events-none"> */}
              <Spline scene="https://prod.spline.design/M4S11dvJnr65ej9S/scene.splinecode" />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default footer;
