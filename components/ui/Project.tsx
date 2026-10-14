import React from "react";

type Modal = {
  active: boolean;
  index: number;
};

type Props = {
  index: number;
  title: string;
  setModal: ({ active, index }: Modal) => void;
  link: string;
};

// Original row (391d3dc): three nested hover:opacity-50 layers stack to the ~12% fade.
// Only change: no horizontal padding (the page container provides the gutter).
const Project = ({ index, title, setModal, link }: Props) => {
  return (
    <a
      className="group flex w-full justify-between items-center border-t border-gray-300 cursor-pointer transition-all duration-200 hover:opacity-50 focus-visible:outline-2 focus-visible:-outline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
      href={link}
    >
      <div
        className="group flex w-full justify-between items-center py-6 md:py-10 lg:py-[50px] cursor-pointer transition-all duration-200 hover:opacity-50"
        onMouseEnter={() => setModal({ active: true, index })}
        onMouseLeave={() => setModal({ active: false, index })}
      >
        <div className="hover:opacity-50 w-full flex flex-col sm:flex-row justify-between items-center transition-opacity duration-200">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-normal transition-all duration-400 group-hover:-translate-x-2">
            {title}
          </h3>
          <p className="text-sm sm:text-base font-light transition-all duration-400 group-hover:translate-x-2">
            Design & Development
          </p>
        </div>
      </div>
    </a>
  );
};

export default Project;
