import {create} from "zustand";

import analyticsApi from "../api/analyticsApi.js";

import {handleAsyncAction} from "../utils/storeHelpers.js";

export const useAnalyticsStore = create((set) => ({
	analyticsData: {
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	},
	dailySalesData: [],
	loading: false,
	error: null,

	fetchAnalytics: async () => await handleAsyncAction(set, {
		action: () => analyticsApi.get(),
		onSuccess: (res) => set({
			analyticsData: res.data.analyticsData,
			dailySalesData: res.data.dailySalesData
		}),
		errorMessage: "Failed to fetch analytics data.",
		shouldUpdateStoreError: false,
		handleErrorOptions: {
			isGlobal: true,
			forceUserMessage: true
		}
	}),

	clearError: () => set({ error: null })
}));