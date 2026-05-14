export const Currency = {
	toCents(value: number): number {
		const amount = value || 0;
		return Math.round(amount * 100);
	},
	fromCents(value: number): number {
		const amount = value || 0;
		return amount / 100;
	},
	calculatePercentage(amountInCents: number, percentage: number): number {
		if (!amountInCents || !percentage) return 0;
		return Math.round((amountInCents * percentage) / 100);
	}
};