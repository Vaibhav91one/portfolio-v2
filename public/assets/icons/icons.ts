import NextJsIcon from "./nextjs.svg"; // ✅ Imported as a React component
import TypeScriptIcon from "./typescript.svg";
import TailwindIcon from "./tailwindcss.svg";
import ReactIcon from "./react.svg";
import ThreeJsIcon from "./threejs.svg";
import ReduxIcon from "./redux.svg";
import NodeJsIcon from "./nodejs.svg";
import MongoDBIcon from "./mongodb.svg";
import SocketIoIcon from "./socketio.svg";

// Define a mapping of tech stack names to SVG components
export const techIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  "Next.js": NextJsIcon,
  "TypeScript": TypeScriptIcon,
  "Tailwind CSS": TailwindIcon,
  "React": ReactIcon,
  "Three.js": ThreeJsIcon,
  "Redux": ReduxIcon,
  "Node.js": NodeJsIcon,
  "MongoDB": MongoDBIcon,
  "Socket.io": SocketIoIcon,
};
