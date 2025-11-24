import { toast } from "react-hot-toast";
import { useGlobalStore } from "../stores/useGlobalStore.js";
import { getErrorMessage } from "./errorParser.js";

/**
 * Handles common API request errors.
 * @param {object} error The error object.
 * @param {string} [defaultMessage="An error occurred"]
 * @param [options] Configuration options for error display.
 * @param {boolean} [options.isGlobal=false] If true, sets a persistent global error.
 * @param {boolean} [options.showToast=true] A flag to determine whether to display a toast notification.
 */
export const handleRequestError = (error, defaultMessage = "An error occurred", options = {}) => {
	console.error("Handling error:", error);

	const { isGlobal = false, showToast = false } = options;
	const setGlobalError = useGlobalStore.getState().setGlobalError;

	const errorMessage = getErrorMessage(error, defaultMessage);

	if (showToast) {
		toast.error(errorMessage);
	}

	if (isGlobal) {
		setGlobalError(errorMessage);
	}
};