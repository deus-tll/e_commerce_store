import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../config/axios.js";
import {handleRequestError} from "../utils/errorHandler.js";

const ANALYTICS_API_PATH = "/analytics";

export const useAnalyticsStore = create((set, get) => ({
	analyticsData: {
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	},
	dailySalesData: [],
	loading: true,
	error: null,

	fetchAnalytics: async () => {
		set({ loading: true, error: null });

		try {
			const res = await axios.get(ANALYTICS_API_PATH);

			set({
				analyticsData: res.data.analyticsData,
				dailySalesData: res.data.dailySalesData
			});
			toast.success("Analytics data fetched successfully!");
		}
		catch (error) {
			set({ error: "Failed to fetch analytics data. Please try again." });
			handleRequestError(error, "Failed to fetch analytics data.");
		}
		finally {
			set({ loading: false });
		}
	}
}));

