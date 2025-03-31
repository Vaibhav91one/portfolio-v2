"use client";

import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const footer = (props: Props) => {
  return (
    <div
      className="relative h-[80vh] min-h-[100vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+80vh)] bottom-[80vh]">
        <div className="h-[85vh] sticky top-[calc(100vh-80vh)]">
          <div className="bg-black text-white py-8 px-12 h-full w-full flex flex-col justify-between">
            {/* <div className="flex shrink-0 gap-20">
              <div className="flex flex-col gap-2">
                <h3 className="mb-2 uppercase text-[#ffffff80]">About</h3>

                <p>Home</p>

                <p>Projects</p>

                <p>Our Mission</p>

                <p>Contact Us</p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="mb-2 uppercase text-[#ffffff80]">Education</h3>

                <p>News</p>

                <p>Learn</p>

                <p>Certification</p>

                <p>Publications</p>
              </div>
            </div> */}
            <div className="flex justify-between items-end">
              <h1 className="text-[14vw] leading-[0.8] mt-10">Sticky Footer</h1>
              <p>©copyright</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footer;
