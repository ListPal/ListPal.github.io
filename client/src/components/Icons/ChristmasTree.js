import React from "react";

const ChristmasTree = ({ color = "#000000", star='#000000', size=160 }) => {
  return (
    <>
      <svg
        height={size}
        width={size}
        version="1.1"
        id="_x32_"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <polygon
              fill={star} // Star
              className="st0"
              points="222.033,104.558 256.005,86.698 289.976,104.558 283.481,66.728 310.973,39.93 272.991,34.418 256.005,0 239.02,34.418 201.027,39.93 228.52,66.728 "
            />
            <polygon fill={color} points="221.471,187.887 299.832,209.099 256.005,109.124 " />
            <polygon
              fill={color}
              points="315.968,245.904 208.764,216.882 179.306,284.056 353.353,331.189 "
            />
            <polygon
              fill={color}
              className="st0"
              points="369.49,367.983 166.6,313.059 137.141,380.234 406.874,453.26 "
            />
            <polygon
              fill={color}
              points="423.012,490.064 124.435,409.228 79.375,512 256.005,512 432.625,512 "
            />
          </g>
        </g>
      </svg>
    </>
  );
};
export default ChristmasTree;
