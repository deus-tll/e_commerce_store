import {create} from "zustand";

import axios from "../config/axios.js";
import {handleError} from "../utils/errorHandler.js";
import {ApiPaths} from "../constants/api.js";
import {PaginationLimits} from "../constants/app.js";
import {OrderStatusValues} from "../constants/domain.js";

const INITIAL_PAGINATION = Object.freeze({
	page: 1,
	limit: PaginationLimits.ORDERS,
	total: 0,
	pages: 1
});
export const OrderFilterKeys = Object.freeze({
	STATUS: "status",
});
const INITIAL_ORDER_FILTERS = Object.freeze({
	status: "",
});

export const useOrderStore = create((set, get) => ({
	orders: [],
	currentOrder: null,
	pagination: INITIAL_PAGINATION,
	filters: INITIAL_ORDER_FILTERS,
	loading: false,
	error: null,

	/**
	 * Internal helper to clean filters state from empty or invalid values.
	 * @private
	 */
	_filtersCleanup: (currentFilters) => {
		const cleanFilters = { ...currentFilters };

		Object.keys(cleanFilters).forEach(key => {
			if (cleanFilters[key] === "") delete cleanFilters[key];
		});

		return cleanFilters;
	},

	/**
	 * Internal helper to handle all paginated order fetching logic.
	 * @private
	 */
	_fetchPaginatedOrders: async (path) => {
		set({ loading: true });

		try {
			const { page, limit } = get().pagination;
			const cleanFilters = get()._filtersCleanup(get().filters);

			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				...cleanFilters
			});

			const res = await axios.get(`${path}?${params}`);

			set({
				orders: res.data.orders,
				pagination: res.data.pagination
			});

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load orders. Please refresh.", {
				isGlobal: true,
				showToast: false,
				forceUserMessage: true
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},
	/**
	 * Internal helper to handle single order fetching logic.
	 * @private
	 */
	_fetchOrder: async (path, errorMessage, isGlobal, showToast) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.get(path);
			set({ currentOrder: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, errorMessage, {
				isGlobal, showToast
			});
			set({ currentOrder: null, error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchOrders: async () => get()._fetchPaginatedOrders(ApiPaths.ORDERS),
	fetchMyOrders: async () => get()._fetchPaginatedOrders(`${ApiPaths.ORDERS}/mine`),
	fetchOrderById: async (id) => {
		return await get()._fetchOrder(
			`${ApiPaths.ORDERS}/${id}`,
			"Failed to load order details.",
			true,
			false
		);
	},
	fetchOrderByNumber: async (orderNumber) => {
		return await get()._fetchOrder(
			`${ApiPaths.ORDERS}/number/${orderNumber}`,
			"Order not found.",
			false,
			true
			);
	},
	fetchOrderByPaymentSessionId: async (paymentSessionId) => {
		return await get()._fetchOrder(
			`${ApiPaths.ORDERS}/payment-session/${paymentSessionId}`,
			"Order not found.",
			false,
			true
		);
	},
	updateOrderStatus: async (id, status, options = { refreshList: false }) => {
		const { refreshList } = options;

		set({ loading: true, error: null });

		try {
			const res = await axios.patch(`${ApiPaths.ORDERS}/${id}/status`, { status });
			const updatedOrder = res.data;

			set((state) => ({
				currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
			}));

			if (refreshList) {
				await get().fetchOrders();
			}

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to update order status", {
				isGlobal: false,
				showToast: false,
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	setPage: async (newPage = 1) => {
		const { pages, total } = get().pagination;

		const isInitialLoad = total === 0;
		const isWithinBounds = newPage > 0 && newPage <= pages;

		if (!isInitialLoad && !isWithinBounds) {
			return;
		}

		set((state) => ({
			pagination: { ...state.pagination, page: newPage },
			error: null
		}));

		await get().fetchOrders();
	},
	updateFilters: async (key, value) => {
		if(key === OrderFilterKeys.STATUS && value !== "" && !OrderStatusValues.includes(value)) {
			set({ error: "Invalid status selected." });
			return;
		}

		set((state) => ({
			filters: { ...state.filters, [key]: value },
			pagination: { ...state.pagination, page: 1 },
			error: null
		}));

		await get().fetchOrders();
	},
	clearFilters: async () => {
		set((state) => ({
			filters: INITIAL_ORDER_FILTERS,
			pagination: { ...state.pagination, page: 1 },
			error: null
		}));

		await get().fetchOrders();
	},

	clearCurrentOrder: () => set({ currentOrder: null }),
	clearError: () => set({ error: null })
}));