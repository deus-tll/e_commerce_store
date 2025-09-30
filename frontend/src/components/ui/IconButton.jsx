import Button from "./Button.jsx";

const IconButton = ({ variant = "ghost", className = "p-2", children, ...props }) => {
    return (
        <Button variant={variant} className={className} applyBasePadding {...props}>
            {children}
        </Button>
    );
};

export default IconButton;