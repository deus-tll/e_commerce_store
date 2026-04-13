import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/cart");

const cartApi = {
	get: () => api.get(pathWithBase()),
	addToCart: (productId) => api.post(pathWithBase(), { productId }),
	removeFromCart: (productId) => api.delete(pathWithBase(productId)),
	clear: () => api.delete(pathWithBase()),
	updateQuantity: (productId, quantity) => api.patch(pathWithBase(productId), { quantity })
};

export default cartApi;