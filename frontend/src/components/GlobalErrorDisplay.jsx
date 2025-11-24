import { X, AlertTriangle } from "lucide-react";

import { useGlobalStore } from "../stores/useGlobalStore.js";

import Button from "./ui/Button.jsx";

const GlobalErrorDisplay = () => {
	const { globalError, clearGlobalError } = useGlobalStore();

	if (!globalError) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-[100] p-4 bg-red-700 shadow-lg">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-3 text-white">
					<AlertTriangle className="h-5 w-5 flex-shrink-0" />
					<p className="font-medium">{globalError}</p>
				</div>
				<Button
					onClick={clearGlobalError}
					variant="ghost"
					className="p-1 text-white hover:bg-red-800"
				>
					<X className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}

export default GlobalErrorDisplay;