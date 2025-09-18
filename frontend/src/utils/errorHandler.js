import { toast } from "react-hot-toast";

/**
 * Handles common API request errors by logging to the console and conditionally displaying a toast notification.
 * @param {object} error The error object returned from the API request.
 * @param {string} [defaultMessage="An error occurred"] A default message to display if the API response does not contain a specific message.
 * @param {boolean} [showToast=true] A flag to determine whether to display a toast notification to the user.
 */
export const handleRequestError = (error, defaultMessage = "An error occurred", showToast = true) => {
	console.error("Handling error:", error);
	let errorMessage = defaultMessage;

	if (error.response?.data?.message) {
		errorMessage = error.response.data.message;
	}
	else if (error.message) {
		errorMessage = error.message;
	}

	if (showToast) {
		toast.error(errorMessage);
	}
};