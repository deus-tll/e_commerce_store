import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/reviews");

const reviewApi = {
	getAllByProduct: (productId, params) => api.get(pathWithBase(`/product/${productId}`), { params }),
	
	create: (productId, reviewData) => api.post(pathWithBase(`/product/${productId}`), reviewData),
	update: (reviewId, reviewData) => api.patch(pathWithBase(reviewId), reviewData),
	delete: (reviewId) => api.delete(pathWithBase(reviewId)),
};

export default reviewApi;