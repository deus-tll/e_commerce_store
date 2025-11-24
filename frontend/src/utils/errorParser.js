/**
 * Extracts a user-friendly error message from a complex error object.
 * @param {object} error The error object.
 * @param {string} [defaultMessage="An unexpected error occurred."] Fallback message.
 * @returns {string} The extracted or default error message.
 */
export const getErrorMessage = (error, defaultMessage = "An unexpected error occurred.") => {
	if (error.response?.data?.message) {
		return error.response.data.message;
	}

	if (error.message) {
		return error.message;
	}

	return defaultMessage;
}