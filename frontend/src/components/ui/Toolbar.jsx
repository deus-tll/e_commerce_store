const Toolbar = ({ children, className = "" }) => {
    return (
        <div className={`flex flex-col lg:flex-row gap-4 items-center justify-between ${className}`}>
            {children}
        </div>
    );
};

export default Toolbar;


