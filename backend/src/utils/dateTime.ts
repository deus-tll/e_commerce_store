import {MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND} from "../constants/time.js";

export const DateTime = {
	getDatesInRange(startDate: Date, endDate: Date): string[] {
		const dates: string[] = [];

		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			// Format date as YYYY-MM-DD
			dates.push(currentDate.toISOString().split("T")[0]);
			// Advance the date by one day
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	},

	/**
	 * Generates a continuous sequence of dates and fills in missing data points
	 * within a specified date range.
	 */
	fillDateGaps(
		startDate: Date,
		endDate: Date,
		rawData: any[],
		dateKey: string,
		defaultValue: Record<string, any>
	): any[] {
		const dateArray = this.getDatesInRange(startDate, endDate);
		const dataMap = new Map<string, any>();

		rawData.forEach(item => {
			dataMap.set(item[dateKey], item);
		});

		return dateArray.map((date: string) => {
			if (dataMap.has(date)) {
				// Data exists for this date, return it
				return dataMap.get(date);
			}

			// Data is missing, fill with default values and the current date
			return {
				[dateKey]: date,
				...defaultValue
			};
		});
	},

	/**
	 * Converts a Time-To-Live string (e.g., '15m', '7d') into milliseconds.
	 * Units supported: ms (milliseconds) s (seconds), m (minutes), h (hours), d (days).
	 */
	ttlToMilliseconds(ttlString: string): number {
		if (!ttlString) return 0;

		const match = ttlString.match(/^(\d+)(ms|s|m|h|d)?$/);
		if (!match) return 0;

		const value = parseInt(match[1], 10);
		const unit = match[2];

		switch (unit) {
			case 'ms': return value;
			case 's': return value * MS_PER_SECOND;
			case 'm': return value * MS_PER_MINUTE;
			case 'h': return value * MS_PER_HOUR;
			case 'd': return value * MS_PER_DAY;
			default:
				// If not specified, then assume it is seconds
				return value * MS_PER_SECOND;
		}
	},

	/**
	 * Converts a Time-To-Live string (e.g., '15m', '7d') into seconds.
	 * Units supported: ms (milliseconds) s (seconds), m (minutes), h (hours), d (days).
	 */
	ttlToSeconds(ttlString: string): number {
		return Math.floor(this.ttlToMilliseconds(ttlString) / 1000);
	},
}