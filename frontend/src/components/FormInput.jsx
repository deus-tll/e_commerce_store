const FormInput = ({ label, icon: Icon, inputElement, id, name, type, value, onChange, placeholder, required = true, rows, step, children }) => {
	const commonClasses = `block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
	placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`;

	const iconPaddingClass = Icon ? "pl-10" : "pl-4";

	const renderInput = () => {
		switch (inputElement) {
			case "input":
				return (
					<input
						id={id}
						name={name}
						type={type}
						required={required}
						value={value}
						onChange={onChange}
						step={step}
						placeholder={placeholder}
						className={`${commonClasses} ${iconPaddingClass}`}
					/>
				);
			case "textarea":
				return (
					<textarea
						id={id}
						name={name}
						required={required}
						value={value}
						onChange={onChange}
						rows={rows}
						placeholder={placeholder}
						className={`${commonClasses} ${iconPaddingClass}`}
					/>
				);
			case "select":
				return (
					<select
						id={id}
						name={name}
						required={required}
						value={value}
						onChange={onChange}
						className={`${commonClasses} ${iconPaddingClass}`}
					>
						{children}
					</select>
				);
			default:
				return null;
		}
	};

	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-300">
				{label}
			</label>

			<div className="mt-1 relative rounded-md shadow-sm">
				{Icon &&
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</div>
				}

				{renderInput()}
			</div>
		</div>
	);
};

export default FormInput;