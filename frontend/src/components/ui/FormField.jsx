const FormField = ({ label, error, children, hint }) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            {children}
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
    );
};

export default FormField;