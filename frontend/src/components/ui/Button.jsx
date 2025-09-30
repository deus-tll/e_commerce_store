const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const basePadding = "px-4 py-2";

const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-500",
    warning: "bg-yellow-500 text-gray-900 hover:bg-yellow-400",
    ghost: "bg-transparent text-gray-200 hover:bg-gray-700",
};

const Button = ({ variant = "primary", className = "", applyBasePadding = true, children, ...props }) => {
    return (
        <button
            className={`
                ${base} 
                ${variants[variant]} 
                ${className} 
                ${applyBasePadding ? basePadding : ""}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;