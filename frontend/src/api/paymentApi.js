import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/payments");

const paymentApi = {
	createCheckoutSession: (products, couponCode, customerDetails) => api.post(pathWithBase("create-checkout-session"), { products, couponCode, customerDetails }),
	getOrderStatus: (sessionId) => api.get(pathWithBase(`order-status/${sessionId}`))
};

export default paymentApi;