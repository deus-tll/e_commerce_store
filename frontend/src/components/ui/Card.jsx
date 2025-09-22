const Card = ({ children, className = "" }) => {
    return (
        <div className={`bg-gray-800 shadow-lg rounded-lg ${className}`}>
            {children}
        </div>
    );
};

export default Card;