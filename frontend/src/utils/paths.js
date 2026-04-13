export const makePathWithBase = (base) => {
	const BASE = String(base).replace(/\/+$/, "");
	return (rawPath = "") => {
		const path = String(rawPath).trim();
		if (!path) return BASE;
		const clean = path.startsWith("/") ? path.slice(1) : path;
		return `${BASE}/${clean}`;
	};
};