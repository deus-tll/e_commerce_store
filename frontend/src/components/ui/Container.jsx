const Container = ({ size = "lg", className = "", children }) => {
    const sizeMap = {
        sm: "max-w-xl",
        md: "max-w-3xl",
        lg: "max-w-7xl"
    };
    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 ${sizeMap[size]} ${className}`}>
            {children}
        </div>
    );
};

export default Container;