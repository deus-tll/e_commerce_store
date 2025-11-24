import {create} from "zustand";

export const useGlobalStore = create((set) => ({
	globalError: null,

	setGlobalError: (message) => {
		set({ globalError: message });
	},

	clearGlobalError: () => {
		set({ globalError: null})
	}
}));