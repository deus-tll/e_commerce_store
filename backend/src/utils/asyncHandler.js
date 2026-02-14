/**
 * Wraps an async function to catch errors and pass them to the next middleware.
 * @param {Function} fn - The async method.
 * @returns {Function} - Express middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};