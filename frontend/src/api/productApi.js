import qs from "qs";
import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/products");
const qsOptions = { arrayFormat: "indices", skipNulls: true };

const productApi = {
	getAll: (params = {}) => {
		return api.get(pathWithBase(), {
			params,
			paramsSerializer: p => qs.stringify(p, qsOptions)
		})
	},
	getById: (productId) => api.get(pathWithBase(`/${encodeURIComponent(productId)}`)),
	getFeatured: () => api.get(pathWithBase(`/featured`)),
	getRecommendations: () => api.get(pathWithBase(`/recommended`)),
	getFacets: (categoryId) => api.get(pathWithBase(`/categories/${encodeURIComponent(categoryId)}/facets`)),

	create: (productData) => api.post(pathWithBase(), productData),
	update: (productId, productData) => api.patch(pathWithBase(`/${encodeURIComponent(productId)}`), productData),
	toggleFeatured: (productId) => api.patch(pathWithBase(`/${encodeURIComponent(productId)}/featured`)),
	delete: (productId) => api.delete(pathWithBase(`/${encodeURIComponent(productId)}`)),
};

export default productApi;