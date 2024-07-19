// import PropTypes from "prop-types";

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${type} ${textColor} ${bgColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
// Button.propTypes = {
//   children: PropTypes.node.isRequired,
//   type: PropTypes.string.isRequired,
//   bgColor: PropTypes.string, // Make bgColor optional
//   textColor: PropTypes.string,
//   className: PropTypes.string, // Assuming className is always expected
// };
export default Button;
