import { SVGProps } from "react";

const SvgSkipPrevious = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 7V17"
      stroke="black"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.0282 5.26715C17.4217 4.95652 18 5.23677 18 5.73808V18.2619C18 18.7632 17.4217 19.0434 17.0282 18.7328L9.0965 12.4709C8.7922 12.2307 8.7922 11.7693 9.0965 11.5291L17.0282 5.26715Z"
      fill={props.color ?? "black"}
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgSkipPrevious;
