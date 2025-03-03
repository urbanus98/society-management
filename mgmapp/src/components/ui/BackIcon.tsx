const BackIcon = ({ color = "white", size = 50 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="shadow-hover pointer"
  >
    <mask id="arrowMask">
      {/* <!-- Fill everything white (visible) --> */}
      <rect width="100" height="100" fill="white" />
      {/* <!-- The arrow is black (transparent in mask) --> */}
      <polygon points="55,25 30,50 55,75 65,65 45,50 65,35" fill="black" />
    </mask>

    {/* <!-- Background Circle with Mask Applied --> */}
    <circle cx="50" cy="50" r="48" fill={color} mask="url(#arrowMask)" />
  </svg>
);

export default BackIcon;
