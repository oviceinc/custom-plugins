import { SVGProps } from "react";

const SvgSkipNext = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 7V17"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.97179 5.26715C6.57832 4.95652 6 5.23677 6 5.73808V18.2619C6 18.7632 6.57832 19.0434 6.97179 18.7328L14.9035 12.4709C15.2078 12.2307 15.2078 11.7693 14.9035 11.5291L6.97179 5.26715Z"
      fill={props.color ?? "black"}
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgSkipNext;
