/**
 * @interface IDateTimeService
 * @description Contract for general, non-domain-specific date and time utility operations.
 */
export class IDateTimeService {
	/**
	 * Generates a continuous sequence of dates and fills in missing data points
	 * within a specified date range.
	 * @param {Date} startDate - The start of the date range (inclusive).
	 * @param {Date} endDate - The end of the date range (inclusive).
	 * @param {Array<Object>} rawData - The sparse, raw data from the repository.
	 * @param {string} dateKey - The property name in rawData that holds the date string (e.g., 'date').
	 * @param {Object} defaultValue - The default object to use for missing dates (e.g., {sales: 0, revenue: 0}).
	 * @returns {Array<Object>} - A continuous series of data points for every day in the range.
	 */
	fillDateGaps(startDate, endDate, rawData, dateKey, defaultValue) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Retrieves an array of date strings between two dates.
	 * @param {Date} startDate
	 * @param {Date} endDate
	 * @returns {string[]}
	 */
	getDatesInRange(startDate, endDate) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Converts a Time-To-Live string (e.g., '15m', '7d') into milliseconds.
	 * Units supported: s (seconds), m (minutes), h (hours), d (days).
	 * @param {string} ttlString - The TTL string.
	 * @returns {number} - The TTL duration in milliseconds.
	 */
	ttlToMilliseconds(ttlString) {
		throw new Error("Method not implemented.");
	}
}