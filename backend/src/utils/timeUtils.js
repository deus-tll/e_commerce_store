import { MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY } from "./timeConstants.js";

export function ttlToMilliseconds(ttlString) {
	if (!ttlString) return 0;

	const unit = ttlString.slice(-1);
	const value = parseInt(ttlString.slice(0, -1), 10);

	if (isNaN(value)) return 0;

	switch (unit) {
		case 's': // Seconds
			return value * 1000;
		case 'm': // Minutes
			return value * MS_PER_MINUTE;
		case 'h': // Hours
			return value * MS_PER_HOUR;
		case 'd': // Days
			return value * MS_PER_DAY;
		default:
			// If not specified, then assume it is seconds
			return parseInt(ttlString, 10) * 1000;
	}
}