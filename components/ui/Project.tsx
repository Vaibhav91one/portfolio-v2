import React from "react";

type Modal = {
  active: boolean;
  index: number;
};

type Props = {
  index: number;
  title: string;
  setModal: ({ active, index }: Modal) => void;
};

const Project = ({ index, title, setModal }: Props) => {
  return (
    <div
      className="group flex w-full justify-between items-center px-[100px] py-[50px] border-t border-gray-300 cursor-pointer transition-all duration-200 last:border-b hover:opacity-50"
      onMouseEnter={() => {
        setModal({ active: true, index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index });
      }}
    >
      <h2 className="text-[60px] m-0 font-normal transition-all duration-400 group-hover:-translate-x-2">
        {title}
      </h2>

      <p className="font-light transition-all duration-400 group-hover:translate-x-2">
        Design & Development
      </p>
    </div>
  );
};

export default Project;
