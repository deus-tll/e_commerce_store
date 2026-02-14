export const getStockStatus = (count) => {
	if (count <= 0) {
		return {
			label: "Out of Stock",
			dotClass: "bg-red-500",
			textClass: "text-red-500"
		};
	}
	if (count < 10) {
		return {
			label: `Only ${count} left - Order soon!`,
			dotClass: "bg-orange-500",
			textClass: "text-orange-500"
		};
	}
	return {
		label: "In Stock - Ready to ship",
		dotClass: "bg-green-400",
		textClass: "text-green-400"
	};
};