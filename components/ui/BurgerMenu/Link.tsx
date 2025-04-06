import { motion } from "framer-motion";
import { scale, slide } from "./anim";

export default function NavLink({
  data,
  isActive,
  setSelectedIndicator,
  setIsActive,
}: any) {
  const { label, id, index } = data;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setSelectedIndicator(`#${id}`);
      setIsActive(false); // 🔥 close the menu
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setSelectedIndicator(`#${id}`)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="relative flex items-center cursor-pointer"
    >
      <motion.div
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
        className="w-2.5 h-2.5 bg-white rounded-full absolute -left-7"
      />
      <a
        href={`#${id}`}
        onClick={handleClick}
        className="text-white font-light"
      >
        {label}
      </a>
    </motion.div>
  );
}
