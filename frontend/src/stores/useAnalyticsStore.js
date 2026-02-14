import { create } from "zustand";

import axios from "../config/axios.js";

import {handleError} from "../utils/errorHandler.js";

const ANALYTICS_API_PATH = "/analytics";

export const useAnalyticsStore = create((set) => ({
	analyticsData: {
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	},
	dailySalesData: [],
	loading: true,

	fetchAnalytics: async () => {
		set({ loading: true });

		try {
			const res = await axios.get(ANALYTICS_API_PATH);

			set({
				analyticsData: res.data.analyticsData,
				dailySalesData: res.data.dailySalesData
			});

			return true;
		}
		catch (error) {
			handleError(error, "Failed to fetch analytics data.", {
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
}));