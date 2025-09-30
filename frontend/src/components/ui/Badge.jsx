const Badge = ({ children, color = "gray", leftIcon: LeftIcon, className = "" }) => {
    const map = {
        gray: "bg-gray-700 text-gray-200",
        blue: "bg-blue-600 text-white",
        green: "bg-green-600 text-white",
        red: "bg-red-600 text-white",
        purple: "bg-purple-600 text-white",
        yellow: "bg-yellow-500 text-gray-900"
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${map[color]} ${className}`}>
            {LeftIcon && <LeftIcon className="h-3 w-3" />}
            {children}
        </span>
    );
};

export default Badge;