import * as React from "react";
import { SVGProps } from "react";
const Compass = (props: SVGProps<SVGSVGElement>) => (
  <div className="w-8 h-8 inline-block py-1">

  <svg
    viewBox="0 0 24 24"   
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="translate(0 -1028.4)">
      <g>
        <path
          d="m23 12a11 11 0 1 1 -22 0 11 11 0 1 1 22 0z"
          transform="translate(0 1029.4)"
          fill="#95a5a6"
        />
        <path
          d="m23 12a11 11 0 1 1 -22 0 11 11 0 1 1 22 0z"
          transform="translate(0 1028.4)"
          fill="#bdc3c7"
        />
        <path
          d="m20 12a8.5 9 0 1 1 -17 0 8.5 9 0 1 1 17 0z"
          transform="matrix(1.0588 0 0 1 -.17647 1028.4)"
          fill="#3498db"
        />
        <path d="m16 1033.4-6 7-2 9 6-7 2-9z" fill="#2980b9" />
        <path
          d="m12 1031.4c-4.9706 0-9 4-9 9 0 0.1 0.0218 0.3 0.0312 0.5 0.2651-4.8 4.1698-8.5 8.9688-8.5s8.704 3.7 8.969 8.5c0.009-0.2 0.031-0.4 0.031-0.5 0-5-4.029-9-9-9z"
          fill="#2980b9"
        />
        <path d="m14 1041.4-4-2 6-7z" fill="#e74c3c" />
        <path d="m10 1039.4 4 2-6 7z" fill="#ecf0f1" />
        <path
          d="m12 1029.4c-6.0751 0-11 4.9-11 11 0 6 4.9249 11 11 11 6.075 0 11-5 11-11 0-6.1-4.925-11-11-11zm0 2c4.971 0 9 4 9 9 0 4.9-4.029 9-9 9-4.9706 0-9-4.1-9-9 0-5 4.0294-9 9-9z"
          fill="#bdc3c7"
        />
      </g>
      <path d="m16 4-4 8 2 1z" transform="translate(0 1028.4)" fill="#c0392b" />
      <path
        d="m12 1039.4c-0.552 0-1 0.4-1 1h2c0-0.6-0.448-1-1-1z"
        fill="#bdc3c7"
      />
      <path
        d="m12 12-4 8 6-7z"
        transform="translate(0 1028.4)"
        fill="#bdc3c7"
      />
      <path
        d="m12 1041.4c0.552 0 1-0.5 1-1h-2c0 0.5 0.448 1 1 1z"
        fill="#7f8c8d"
      />
    </g>
  </svg>
    </div>
);
export default Compass;
