import clsx from "clsx";
import React from "react";

type Modal = {
  active: boolean;
  index: number;
};

type Props = {
  index: number;
  title: string;
  setModal: ({ active, index }: Modal) => void;
  className?: string;
  link: string;
};

const Project = ({ index, title, setModal, className, link }: Props) => {
  return (
    
    <a className="group flex w-full justify-between items-center border-t border-gray-300 cursor-pointer transition-all duration-200 hover:opacity-50" target="_blank" href={link}>
    <div
      className={clsx(
        "group flex w-full justify-between items-center  px-6 md:px-12 lg:px-[100] py-6 md:py-10 lg:py-[50] cursor-pointer transition-all duration-200 hover:opacity-50",
        className // Allows additional classes to be dynamically added
      )}
      onMouseEnter={() => {
        setModal({ active: true, index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index });
      }}
      onClick={()=>{console.log("Clicked")}}
      >
      <div className="hover:opacity-50 w-full flex flex-col sm:flex-row justify-between items-center transition-opacity duration-200">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-normal transition-all duration-400 group-hover:-translate-x-2">
          {title}
        </h2>

        <p className="text-sm sm:text-base font-light transition-all duration-400 group-hover:translate-x-2">
          Design & Development
        </p>
      </div>
    </div>
</a>
  );
};

export default Project;
