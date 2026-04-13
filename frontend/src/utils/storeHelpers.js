import {handleError} from "./errorHandler.js";

export const STORE_SORT_KEY = "sort";

const DEFAULT_KEYS = {
	pagination: "pagination",
	filters: "filters"
};

export const getInitialPagination = (limit = 10) => ({
	page: 1,
	limit,
	total: 0,
	pages: 1
});

export const cleanFilters = (filters) => {
	const cleaned = {};

	Object.entries(filters).forEach(([key, value]) => {
		// null/undefined
		if (value == null) return;
		if (typeof value === "string" && value.trim() === "") return;
		if (Array.isArray(value) && value.length === 0) return;
		if (typeof value === "object" && Object.keys(value).length === 0) return;

		if (key === STORE_SORT_KEY && typeof value === "object") {
			Object.assign(cleaned, value);
			return;
		}

		cleaned[key] = value;
	});

	return cleaned;
};

export const handleAsyncAction = async (set, {
	action,
	onSuccess,
	onError,
	setLoading,
	errorMessage = "Operation failed",
	shouldUpdateStoreError = false,
	handleErrorOptions = {}
}) => {
	const toggleLoading = (val) => setLoading ? setLoading(val) : set({ loading: val });

	toggleLoading(true);
	if (shouldUpdateStoreError) set({ error: null });

	try {
		const res = await action();
		if (onSuccess) await onSuccess(res);

		return true;
	}
	catch (error) {
		let isPrevented = false;
		const preventDefault = () => { isPrevented = true; };

		if (onError) await onError(error, preventDefault);

		if (!isPrevented) {
			const msg = handleError(error, errorMessage, handleErrorOptions);
			if (shouldUpdateStoreError) set({ error: msg });
		}

		return false;
	}
	finally {
		toggleLoading(false);
	}
};

export const handlePaginatedFetch = async (set, get, apiCall, onUpdate, errorMessage, stateKeys = DEFAULT_KEYS) => {
	return await handleAsyncAction(set, {
		action: async () => {
			const { page, limit } = get()[stateKeys.pagination];
			const cleanParams = cleanFilters(get()[stateKeys.filters]);

			const params = { page, limit, ...cleanParams };
			return await apiCall(params);
		},
		onSuccess: (res) => onUpdate(res.data),
		errorMessage,
		shouldUpdateStoreError: false,
		handleErrorOptions: {
			isGlobal: true,
			forceUserMessage: true
		}
	});
};

export const handleSetPage = async (set, get, newPage, fetchDataFn, stateKeys = DEFAULT_KEYS) => {
	const { pages, total } = get()[stateKeys.pagination];

	const isFirstTime = total === 0;
	const isValidPage = newPage > 0 && newPage <= pages;

	if (isFirstTime || isValidPage) {
		set((state) => ({
			[stateKeys.pagination]: { ...state[stateKeys.pagination], page: newPage },
			error: null
		}));

		await fetchDataFn();
	}
}

/**
 * Generic helper to update a single filter and reset to page 1.
 */
export const handleUpdateFilter = async (set, fetchDataFn, key, value, stateKeys = DEFAULT_KEYS) => {
	set((state) => ({
		[stateKeys.filters]: { ...state[stateKeys.filters], [key]: value },
		[stateKeys.pagination]: { ...state[stateKeys.pagination], page: 1 },
		error: null
	}));

	await fetchDataFn();
}

/**
 * Generic helper to clear all filters and reset pagination.
 */
export const handleClearFilters = async (set, fetchDataFn, initialFilters, shouldFetch = false, options = {}) => {
	const {
		limit = 10,
		stateKeys = DEFAULT_KEYS
	} = options;

	set(() => ({
		[stateKeys.filters]: initialFilters,
		[stateKeys.pagination]: getInitialPagination(limit),
		error: null
	}));

	if (shouldFetch && typeof fetchDataFn === 'function') {
		await fetchDataFn();
	}
};

export const handleDeletionNavigation = async (get, setPageFn, fetchDataFn, stateKeys = DEFAULT_KEYS) => {
	const { page, total, limit } = get()[stateKeys.pagination];
	const isLastItemOnPage = (total - 1) <= (page - 1) * limit;
	const shouldGoBack = page > 1 && isLastItemOnPage;

	if (shouldGoBack) {
		await setPageFn(page - 1);
	} else {
		await fetchDataFn();
	}
}