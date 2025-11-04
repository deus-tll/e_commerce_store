export const Currency = {
	toCents(value) {
		return Math.round(value * 100);
	},
	fromCents(value) {
		return value / 100;
	}
};