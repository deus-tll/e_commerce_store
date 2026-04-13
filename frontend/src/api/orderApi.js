import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/orders");

const orderApi = {
	getAll: (params) => api.get(pathWithBase(), { params }),
	getMyAll: (params) => api.get(pathWithBase(`/mine`), { params }),
	getById: (orderId) => api.get(pathWithBase(orderId)),
	getByNumber: (orderNumber) => api.get(pathWithBase(`/number/${orderNumber}`)),
	getByPaymentSessionId: (paymentSessionId) => api.get(pathWithBase(`/payment-session/${paymentSessionId}`)),

	updateStatus: (orderId, status) => api.patch(pathWithBase(`/${orderId}/status`), { status })
};

export default orderApi;