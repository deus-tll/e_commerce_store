import { toast } from "react-hot-toast";
import { useGlobalStore } from "../stores/useGlobalStore.js";
import { getErrorMessage } from "./errorParser.js";

/**
 * Handles all application errors (API and client-side).
 * @param {object} error The original error object.
 * @param {string} [userMessage="An error occurred"] The developer's final fallback/override message.
 * @param {object} [options] Configuration options for error display.
 * @param {boolean} [options.isGlobal=false] If true, sets a persistent global error.
 * @param {boolean} [options.showToast=true] A flag to determine whether to display a toast notification.
 * @param {boolean} [options.forceUserMessage=false] If true, the provided userMessage overrides any message parsed from the API response.
 * @returns {string} The final, user-friendly message used for display.
 */
export const handleError = (error, userMessage = "An error occurred", options = {}) => {
	console.error("Handling error. Response data:", error);
	//console.error("Handling error. Response data:", error.response.data);

	const { isGlobal = false, showToast = true, forceUserMessage = false } = options;
	const setGlobalError = useGlobalStore.getState().setGlobalError;

	let finalMessage = userMessage;

	if (!forceUserMessage) {
		finalMessage = getErrorMessage(error, userMessage);
	}

	if (showToast) {
		toast.error(finalMessage);
	}

	if (isGlobal) {
		setGlobalError(finalMessage);
	}

	return finalMessage;
};