export const getFormDataPayloadForEdit = (initial, current, { include = [], exclude = [], excludeIfEmpty = [] }) => {
	const payload = {};

	include.forEach(key => {
		if (Object.prototype.hasOwnProperty.call(current, key)) {
			payload[key] = current[key];
		}
	});

	Object.keys(current).forEach((key) => {
		if (exclude.includes(key) || include.includes(key)) return;

		const val = current[key];
		const initVal = initial[key];

		const isEmpty = val === "" || val === null || val === undefined;
		if (excludeIfEmpty.includes(key) && isEmpty) return;

		if (Array.isArray(val) && Array.isArray(initVal)) {
			const isChanged =
				val.length !== initVal.length ||
				val.some((item, index) => item !== initVal[index]);

			if (isChanged) {
				payload[key] = val;
			}

			return;
		}

		const normalizedCurrent = (val !== null && val !== undefined) ? String(val) : "";
		const normalizedInitial = (initVal !== null && initVal !== undefined) ? String(initVal) : "";

		if (normalizedCurrent !== normalizedInitial) {
			payload[key] = val;
		}
	});

	return payload;
};