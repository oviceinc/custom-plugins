import { SVGProps } from "react";

const SvgPause = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="64" height="64" rx="32" fill="#0F5987" />
    <path
      d="M34.0129 22.4226C34.6157 21.8319 35.4332 21.5 36.2857 21.5C37.1382 21.5 37.9558 21.8319 38.5586 22.4226C39.1614 23.0134 39.5 23.8146 39.5 24.65V39.35C39.5 40.1854 39.1614 40.9866 38.5586 41.5774C37.9558 42.1681 37.1382 42.5 36.2857 42.5C35.4332 42.5 34.6157 42.1681 34.0129 41.5774C33.4101 40.9866 33.0714 40.1854 33.0714 39.35V24.65C33.0714 23.8146 33.4101 23.0134 34.0129 22.4226Z"
      fill={props.color ?? "white"}
    />
    <path
      d="M25.4414 22.4226C26.0442 21.8319 26.8618 21.5 27.7143 21.5C28.5668 21.5 29.3843 21.8319 29.9871 22.4226C30.5899 23.0134 30.9286 23.8146 30.9286 24.65V39.35C30.9286 40.1854 30.5899 40.9866 29.9871 41.5774C29.3843 42.1681 28.5668 42.5 27.7143 42.5C26.8618 42.5 26.0442 42.1681 25.4414 41.5774C24.8386 40.9866 24.5 40.1854 24.5 39.35V24.65C24.5 23.8146 24.8386 23.0134 25.4414 22.4226Z"
      fill={props.color ?? "white"}
    />
  </svg>
);

export default SvgPause;
