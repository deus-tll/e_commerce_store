import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/payments");

const paymentApi = {
	createCheckoutSession: (products, couponCode) => api.post(pathWithBase("create-checkout-session"), { products, couponCode }),
	checkoutSuccess: (sessionId) => api.post(pathWithBase("checkout-success"), { sessionId })
};

export default paymentApi;