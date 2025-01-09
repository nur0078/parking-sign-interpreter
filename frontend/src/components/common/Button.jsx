import PropTypes from "prop-types";

export const Button = ({
  onClick,
  className = "",
  children,
  icon: Icon,
  variant = "primary",
}) => {
  const baseClasses = "transition duration-300 shadow-md";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    error: "bg-red-500 text-white hover:bg-red-600",
    outline: "bg-white border-2 border-blue-100 text-blue-700 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-center">
        {Icon && <Icon className={`h-6 w-6 ${children ? "mr-2" : ""}`} />}
        {children}
      </div>
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(["primary", "error", "outline"]),
};
