import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/categories");

const categoryApi = {
	getAll: (params) => api.get(pathWithBase(), { params }),
	getBySlug: (slug) => api.get(pathWithBase(`/slug/${slug}`)),

	create: (categoryData) => api.post(pathWithBase(), categoryData),
	update: (categoryId, categoryData) => api.patch(pathWithBase(categoryId), categoryData),
	delete: (categoryId) => api.delete(pathWithBase(categoryId))
};

export default categoryApi;