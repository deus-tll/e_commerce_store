const variants = {
    error: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
    info: "bg-blue-600 text-white",
    warning: "bg-yellow-600 text-white"
};

const Alert = ({ variant = "info", children }) => {
    return (
        <div className={`p-3 rounded ${variants[variant]}`}>{children}</div>
    );
};

export default Alert;