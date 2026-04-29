import {IDateTimeUtility} from "../../interfaces/utilities/IDateTimeUtility.js";

import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND} from "../../constants/time.js";

/**
 * Concrete implementation for general date and time utility.
 * @augments IDateTimeUtility
 */
export class DateTimeUtility extends IDateTimeUtility {
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

		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			// Format date as YYYY-MM-DD
			dates.push(currentDate.toISOString().split("T")[0]);
			// Advance the date by one day
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	ttlToMilliseconds(ttlString) {
		if (!ttlString) return 0;

		const match = ttlString.match(/^(\d+)(ms|s|m|h|d)?$/);
		if (!match) return 0;

		const value = parseInt(match[1], 10);
		const unit = match[2];

		switch (unit) {
			case 'ms': // Milliseconds
				return value;
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
				return value * MS_PER_SECOND;
		}
	}

	ttlToSeconds(ttlString) {
		const ms = this.ttlToMilliseconds(ttlString);
		return Math.floor(ms / 1000);
	}
}