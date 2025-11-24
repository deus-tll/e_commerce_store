import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, className = "" }) => {
	if (!message) return null;

	return (
		<div
			className={`flex items-center p-3 text-sm text-red-100 rounded-lg bg-red-700/80 ${className}`}
			role="alert"
		>
			<AlertCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
			<span className="font-medium">{message}</span>
		</div>
	);
};

export default ErrorMessage;