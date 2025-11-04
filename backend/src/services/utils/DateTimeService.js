import {IDateTimeService} from "../../interfaces/utils/IDateTimeService.js";
import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND} from "../../utils/timeConstants.js";

/**
 * Concrete implementation of IDateTimeService for general date and time utility.
 * @augments IDateTimeService
 */
export class DateTimeService extends IDateTimeService {
	fillDateGaps(startDate, endDate, rawData, dateKey, defaultValue) {
		const dateArray = this.getDatesInRange(startDate, endDate);

		// Convert rawData array into a Map for fast O(1) lookups
		const dataMap = new Map();
		rawData.forEach(item => {
			dataMap.set(item[dateKey], item);
		});

		return dateArray.map((date) => {
			if (dataMap.has(date)) {
				// Data exists for this date, return it
				return dataMap.get(date);
			} else {
				// Data is missing, fill with default values and the current date
				return {
					[dateKey]: date,
					...defaultValue
				};
			}
		});
	}

	getDatesInRange(startDate, endDate) {
		const dates = [];

		// Clone the start date to avoid modifying the original object
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			// Format date as YYYY-MM-DD
			dates.push(currentDate.toISOString().split("T")[0]);
			// Advance the date by one day
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	/**
	 * Converts a Time-To-Live string (e.g., '15m', '7d') into milliseconds.
	 * @param {string} ttlString - The TTL string.
	 * @returns {number} - The TTL duration in milliseconds.
	 */
	ttlToMilliseconds(ttlString) {
		if (!ttlString) return 0;

		const unit = ttlString.slice(-1);
		const value = parseInt(ttlString.slice(0, -1), 10);

		if (isNaN(value)) return 0;

		switch (unit) {
			case 's': // Seconds
				return value * MS_PER_SECOND;
			case 'm': // Minutes
				return value * MS_PER_MINUTE;
			case 'h': // Hours
				return value * MS_PER_HOUR;
			case 'd': // Days
				return value * MS_PER_DAY;
			default:
				// If not specified, then assume it is seconds
				return parseInt(ttlString, 10) * MS_PER_SECOND;
		}
	}
}