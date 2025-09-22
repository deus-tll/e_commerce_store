const EmptyState = ({ title = "Nothing here", description = "", action = null }) => {
    return (
        <div className="text-center py-12">
            <div className="text-emerald-400 text-xl font-semibold">{title}</div>
            {description && <p className="text-gray-400 mt-2">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;


