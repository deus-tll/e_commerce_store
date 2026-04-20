import {create} from "zustand";

import orderApi from "../api/orderApi.js";

import {PAGINATION_LIMITS} from "../constants/app.js";
import {ORDER_STATUS_VALUES} from "../constants/domain.js";

import {
	getInitialPagination,
	handleAsyncAction,
	handlePaginatedFetch, handleSetPage,
	handleUpdateFilter, handleClearFilters,
} from "../utils/storeHelpers.js";

export const OrderStoreScope = Object.freeze({
	ADMIN: "admin",
	PROFILE: "profile"
});

export const OrderFilterKeys = Object.freeze({
	STATUS: "status",
});
const INITIAL_ORDER_FILTERS = Object.freeze({
	status: "",
});

const  SCOPE_CONFIG = {
	[OrderStoreScope.ADMIN]: {
		pagination: "pagination",
		filters: "filters",
		data: "orders"
	},
	[OrderStoreScope.PROFILE]: {
		pagination: "myOrdersPagination",
		filters: "myOrdersFilters",
		data: "myOrders"
	}
};

export const useOrderStore = create((set, get) => ({
	currentOrder: null,
	loading: false,
	error: null,

	orders: [],
	pagination: getInitialPagination(PAGINATION_LIMITS.ORDERS),
	filters: INITIAL_ORDER_FILTERS,

	myOrders: [],
	myOrdersPagination: getInitialPagination(PAGINATION_LIMITS.ORDERS),
	myOrdersFilters: INITIAL_ORDER_FILTERS,

	fetchOrders: async (scope = OrderStoreScope.ADMIN) => {
		const config = SCOPE_CONFIG[scope];
		const { pagination, filters, data: dataKey } = config;

		const apiCall = scope === OrderStoreScope.PROFILE
			? orderApi.getMyAll
			: orderApi.getAll;

		const errorMessage = scope === OrderStoreScope.PROFILE
			? "Failed to load your orders. Please refresh."
			: "Failed to load orders. Please refresh.";

		return await handlePaginatedFetch(
			set, get, apiCall,
			(resData) => set({ [dataKey]: resData.orders, [pagination]: resData.pagination }),
			errorMessage,
			{ pagination, filters }
		);
	},

	setPage: async (newPage = 1, scope = OrderStoreScope.ADMIN) => {
		const { pagination, filters } = SCOPE_CONFIG[scope];
		await handleSetPage(set, get, newPage, () => get().fetchOrders(scope),{ pagination, filters })
	},

	fetchOrderById: async (orderId) => await handleAsyncAction(set, {
		action: () => orderApi.getById(orderId),
		onSuccess: (res) => set({ currentOrder: res.data }),
		onError: () => set({ currentOrder: null }),
		errorMessage: "Order not found.",
		shouldUpdateStoreError: true
	}),
	fetchOrderByNumber: async (orderNumber) => await handleAsyncAction(set, {
		action: () => orderApi.getByNumber(orderNumber),
		onSuccess: (res) => set({ currentOrder: res.data }),
		onError: () => set({ currentOrder: null }),
		errorMessage: "Order not found.",
		shouldUpdateStoreError: true,
		handleErrorOptions: { showToast: true }
	}),
	fetchOrderByPaymentSessionId: async (paymentSessionId) => await handleAsyncAction(set, {
		action: () => orderApi.getByPaymentSessionId(paymentSessionId),
		onSuccess: (res) => set({ currentOrder: res.data }),
		onError: () => set({ currentOrder: null }),
		errorMessage: "Order not found.",
		shouldUpdateStoreError: true,
		handleErrorOptions: { showToast: true }
	}),

	updateOrderStatus: async (orderId, status, options = { refreshList: false }) => await handleAsyncAction(set, {
		action: () => orderApi.updateStatus(orderId, status),
		onSuccess: async (res) => {
			const updatedOrder = res.data;

			set((state) => ({
				currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
			}));

			if (options.refreshList) await get().fetchOrders();
		},
		errorMessage: "Failed to update order status.",
		shouldUpdateStoreError: true
	}),

	updateFilter: async (key, value, scope = OrderStoreScope.ADMIN) => {
		if(key === OrderFilterKeys.STATUS && value !== "" && !ORDER_STATUS_VALUES.includes(value)) {
			set({ error: "Invalid status selected." });
			return;
		}

		const { pagination, filters } = SCOPE_CONFIG[scope];

		await handleUpdateFilter(set, () => get().fetchOrders(scope), key, value, { pagination, filters });
	},
	clearFilters: async (scope = OrderStoreScope.ADMIN) => {
		const { pagination, filters } = SCOPE_CONFIG[scope];
		await handleClearFilters(
			set, () => get().fetchOrders(scope),
			INITIAL_ORDER_FILTERS, false,
			{ limit: PAGINATION_LIMITS.ORDERS, stateKeys: { pagination, filters } }
		);
	},
	clearFiltersAndFetch: async (scope = OrderStoreScope.ADMIN) => {
		const { pagination, filters } = SCOPE_CONFIG[scope];
		await handleClearFilters(
			set, () => get().fetchOrders(scope),
			INITIAL_ORDER_FILTERS, true,
			{ limit: PAGINATION_LIMITS.ORDERS, stateKeys: { pagination, filters } }
		);
	},

	clearCurrentOrder: () => set({ currentOrder: null }),
	clearError: () => set({ error: null })
}));