import React from "react";

const ShoppingDarkThemeIcon = ({ color, secondary }) => {
  return (
    <>
      <svg width={160} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
          <g clipPath="url(#clip0_901_3091)">
            <path
              d="M29 13L27 29C27 30.1 26.1 31 25 31H7C5.9 31 5 30.1 5 29L3 13H14H18H29Z"
              fill="#FFC44D"
            />
            <path
              d="M3 13L5 29C5 30.104 5.896 31 7 31H25C26.104 31 27 30.104 27 29L29 13M1 13H11M15 13H14L12 1H9M23 1H20L18 13H31M14 18V26M18 18V26M22 18V26M10 18V26"
              stroke={secondary}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_901_3091">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </g>
      </svg>
      {/* <svg
        fill={color}
        height="200px"
        width="200px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" width={300}></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M443.12,477.234l-23.445-357.245c-0.296-4.512-4.043-8.02-8.564-8.02h-40.843c-4.741,0-8.582,3.842-8.582,8.582 s3.841,8.582,8.582,8.582h32.805l22.92,349.223c0.283,4.315-1.189,8.429-4.145,11.586c-2.956,3.156-6.965,4.894-11.288,4.894 h-32.137c-0.405-1.248-1.095-2.424-2.086-3.415L219.741,334.824L102.787,217.871l5.717-88.737h36.517 c4.741,0,8.582-3.842,8.582-8.582s-3.841-8.582-8.582-8.582h-44.565c-4.526,0-8.273,3.514-8.564,8.031L68.877,477.271 c-0.578,8.964,2.614,17.863,8.757,24.417C83.779,508.242,92.456,512,101.44,512h309.121c8.989,0,17.671-3.763,23.816-10.326 C440.523,495.113,443.71,486.203,443.12,477.234z M101.44,494.836c-4.322,0-8.329-1.736-11.284-4.887 c-2.956-3.151-4.43-7.262-4.151-11.573l4.117-63.918l80.378,80.378H101.44z M194.776,494.835v0.001L94.114,394.173 c-0.764-0.764-1.64-1.345-2.571-1.761l4.166-64.674l167.097,167.097H194.776z M287.08,494.836L97.179,304.933l4.139-64.257 l106.285,106.285l147.875,147.875H287.08z" />
          <path d="M296.065,111.97h-82.394c-4.741,0-8.582,3.843-8.582,8.582s3.841,8.582,8.582,8.582h82.394 c4.741,0,8.582-3.842,8.582-8.582S300.805,111.97,296.065,111.97z" />
          <path
            fill={secondary}
            d="M256.015,0c-46.961,0-85.167,38.206-85.167,85.167v78.926c0,4.74,3.841,8.582,8.582,8.582s8.582-3.842,8.582-8.582V85.167 c0-37.497,30.505-68.003,68.003-68.003s68.003,30.506,68.003,68.003v78.926c0,4.74,3.841,8.582,8.582,8.582 s8.582-3.842,8.582-8.582V85.167C341.181,38.206,302.976,0,256.015,0z"
          />
        </g>
      </svg> */}
    </>
  );
};

export default ShoppingDarkThemeIcon;
