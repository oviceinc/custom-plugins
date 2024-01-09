import { SVGProps } from "react";

const SvgShuffle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="20"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.7071 0.741596C21.3166 0.285991 20.6834 0.286007 20.2929 0.74163C19.9024 1.19725 19.9024 1.93595 20.2929 2.39155L20.3594 2.46917C19.1263 2.56008 17.7538 2.77021 16.4181 3.25584C14.5598 3.93148 12.7657 5.14271 11.4763 7.25342C10.302 5.18893 8.75039 3.96687 7.08071 3.27308C4.97846 2.39955 2.75935 2.39976 1.15421 2.39991L1.09091 2.39991C0.48842 2.39991 2.01574e-06 2.9165 0 3.55375C-1.95068e-06 4.191 0.488413 4.7076 1.09091 4.7076C2.75385 4.70761 4.59477 4.7195 6.28293 5.42097C7.82098 6.06006 9.29827 7.30385 10.2866 9.89991C9.29827 12.496 7.82098 13.7397 6.28293 14.3788C4.59477 15.0803 2.75385 15.0922 1.09091 15.0922C0.488417 15.0922 0 15.6088 0 16.246C0 16.8833 0.488417 17.3999 1.09091 17.3999L1.15415 17.3999H1.15416C2.75931 17.4001 4.97844 17.4003 7.08071 16.5267C8.75039 15.8329 10.302 14.6109 11.4763 12.5464C12.7657 14.6571 14.5598 15.8683 16.4181 16.544C17.7538 17.0296 19.1264 17.2397 20.3596 17.3306L20.2929 17.4084C19.9024 17.864 19.9024 18.6028 20.2929 19.0584C20.6834 19.514 21.3169 19.5136 21.7075 19.058L21.7082 19.0571L23.1536 17.3708C23.6383 17.2534 24 16.7944 24 16.2461C24 16.1888 23.9961 16.1325 23.9884 16.0774C24.0349 15.7229 23.9412 15.3481 23.7071 15.075L21.7071 12.7416C21.3166 12.286 20.6834 12.286 20.2929 12.7416C19.9024 13.1972 19.9024 13.936 20.2929 14.3916L20.8575 15.0503C19.6567 14.9836 18.3618 14.8104 17.1274 14.3616C15.2953 13.6955 13.6102 12.4278 12.6243 9.8999C13.6102 7.37196 15.2953 6.10429 17.1274 5.43819C18.3619 4.98935 19.6567 4.81621 20.8576 4.74945L20.2929 5.40827C19.9024 5.86387 19.9024 6.60258 20.2929 7.05821C20.6834 7.51383 21.3166 7.51378 21.7071 7.05818L23.7071 4.72485C23.9412 4.45177 24.035 4.07699 23.9884 3.72242C23.9961 3.66736 24 3.61105 24 3.55375C24 3.00533 23.6383 2.54628 23.1534 2.42895L21.7071 0.741596Z"
      fill={props.color ?? "black"}
    />
  </svg>
);

export default SvgShuffle;