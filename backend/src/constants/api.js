import {config} from "../config.js";

const API_BASE = config.app.apiBaseUrl;

export const RouteTypes = Object.freeze({
	AUTH: `${API_BASE}/auth`,
	ANALYTICS: `${API_BASE}/analytics`,
	CART: `${API_BASE}/cart`,
	CATEGORY: `${API_BASE}/categories`,
	COUPON: `${API_BASE}/coupons`,
	ORDER: `${API_BASE}/orders`,
	PAYMENT: `${API_BASE}/payments`,
	PRODUCT: `${API_BASE}/products`,
	REVIEW: `${API_BASE}/reviews`,
	USER: `${API_BASE}/users`,
});