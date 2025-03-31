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
};

const Project = ({ index, title, setModal, className }: Props) => {
  return (
    <div
      className={clsx(
        "group flex w-full justify-between items-center px-[100px] border-t border-gray-300 cursor-pointer transition-opacity duration-200 last:border-b",
        className // Allows additional classes to be dynamically added
      )}
      onMouseEnter={() => {
        setModal({ active: true, index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index });
      }}
    >
      <div className="hover:opacity-50 flex w-full justify-between items-center transition-opacity duration-200 ">
        <h2 className="text-[60px] m-0 font-normal transition-all duration-400 group-hover:-translate-x-2">
          {title}
        </h2>

        <p className="font-light transition-all duration-400 group-hover:translate-x-2">
          Design & Development
        </p>
      </div>
    </div>
  );
};

export default Project;
