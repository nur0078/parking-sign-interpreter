import PropTypes from "prop-types";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
