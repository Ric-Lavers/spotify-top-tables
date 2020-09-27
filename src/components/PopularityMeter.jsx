import React from "react";

const PopularityMeter = ({ popularity, className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 500 100"
  >
    <g>
      <rect
        style={{ stroke: "lime", fill: "lime", strokeWidth: 10 }}
        width={500 * (popularity / 100)}
        height="100"
      />
      <rect
        width="500"
        height="100"
        style={{ stroke: "#280", fill: "none", strokeWidth: 10 }}
      />
      <text
        x={350}
        y="64"
        style={{ fontSize: "50px", stroke: "#320", fill: "#280" }}
      >
        {popularity}%
      </text>
    </g>
  </svg>
);

export default PopularityMeter;
