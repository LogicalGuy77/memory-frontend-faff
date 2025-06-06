const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
