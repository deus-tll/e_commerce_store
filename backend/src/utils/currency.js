export const Currency = {
	toCents(value) {
		const amount = Number(value) || 0;
		return Math.round(amount * 100);
	},
	fromCents(value) {
		const amount = Number(value) || 0;
		return amount / 100;
	},
	calculatePercentage(amountInCents, percentage) {
		if (!amountInCents || !percentage) return 0;
		return Math.round((amountInCents * percentage) / 100);
	}
};