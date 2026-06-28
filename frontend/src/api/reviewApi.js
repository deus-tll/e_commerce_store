import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/reviews");

const reviewApi = {
	getAllByProduct: (productId, params) => api.get(pathWithBase(`/product/${productId}`), { params }),
	
	create: (productId, reviewData) => api.post(pathWithBase(`/product/${productId}`), reviewData),
	update: (id, reviewData) => api.patch(pathWithBase(id), reviewData),
	delete: (id) => api.delete(pathWithBase(id)),
};

export default reviewApi;