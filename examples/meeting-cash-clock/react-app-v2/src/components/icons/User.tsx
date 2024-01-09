import { SVGProps } from "react";

const SvgUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.59939 7.49653C10.2891 6.9569 10.7924 6.21691 11.0395 5.37951C11.2866 4.5421 11.2651 3.64893 10.978 2.82425C10.6909 1.99956 10.1525 1.28438 9.43764 0.778197C8.7228 0.272014 7.86709 0 6.98957 0C6.11204 0 5.25633 0.272014 4.54149 0.778197C3.82665 1.28438 3.28822 1.99956 3.00112 2.82425C2.71401 3.64893 2.69251 4.5421 2.9396 5.37951C3.18669 6.21691 3.69008 6.9569 4.37974 7.49653C3.19799 7.96738 2.16687 8.74835 1.39631 9.75616C0.625746 10.764 0.144627 11.9609 0.00424314 13.2192C-0.00591858 13.3111 0.00221475 13.4041 0.0281785 13.4928C0.0541423 13.5816 0.0974282 13.6643 0.155565 13.7365C0.272977 13.8821 0.443751 13.9754 0.630319 13.9958C0.816888 14.0162 1.00397 13.9621 1.1504 13.8453C1.29684 13.7285 1.39063 13.5587 1.41116 13.3731C1.56562 12.0056 2.22132 10.7425 3.25296 9.82534C4.2846 8.90815 5.61987 8.40112 7.00364 8.40112C8.38741 8.40112 9.72267 8.90815 10.7543 9.82534C11.786 10.7425 12.4416 12.0056 12.5961 13.3731C12.6152 13.545 12.6977 13.7038 12.8276 13.8188C12.9575 13.9338 13.1257 13.9968 13.2996 13.9958H13.377C13.5614 13.9747 13.7299 13.8819 13.8458 13.7378C13.9618 13.5937 14.0158 13.4098 13.996 13.2262C13.8549 11.9643 13.3712 10.7643 12.5967 9.75497C11.8222 8.7456 10.7861 7.96489 9.59939 7.49653ZM6.98957 6.99981C6.43304 6.99981 5.88902 6.83569 5.42629 6.5282C4.96356 6.22071 4.6029 5.78366 4.38993 5.27232C4.17696 4.76098 4.12123 4.19832 4.22981 3.65549C4.33838 3.11265 4.60637 2.61403 4.99989 2.22267C5.39341 1.83131 5.89479 1.56478 6.44062 1.45681C6.98645 1.34883 7.55221 1.40425 8.06637 1.61605C8.58053 1.82786 9.01999 2.18653 9.32918 2.64672C9.63836 3.10692 9.80339 3.64796 9.80339 4.20143C9.80339 4.9436 9.50694 5.65538 8.97924 6.18018C8.45155 6.70498 7.73584 6.99981 6.98957 6.99981Z"
      fill={props.color ?? "#202020"}
    />
  </svg>
);

export default SvgUser;