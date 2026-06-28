import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/payments");

const paymentApi = {
	createCheckoutSession: (items, couponCode, customerDetails) =>
		api.post(
			pathWithBase("create-checkout-session"),
			{ items, couponCode, customerDetails }
		)
};

export default paymentApi;