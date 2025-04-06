import * as React from "react";

interface TwitterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const TwitterIcon = ({ size = 30, ...props }: TwitterIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="m2.367 3 7.096 10.14L2.74 21h2.64l5.265-6.17L14.96 21h6.91L14.45 10.375 20.74 3h-2.6l-4.869 5.688L9.3 3H2.367zm3.84 2h2.049l9.777 14h-2.031L6.207 5z"
      fill="white"
    />
  </svg>
);

export default TwitterIcon;
