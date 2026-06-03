import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/users");

const userApi = {
	getAll: (params) => api.get(pathWithBase(), { params }),
	getStats: () => api.get(pathWithBase(`/stats`)),

	create: (userData) => api.post(pathWithBase(), userData),
	update: (id, userData) => api.patch(pathWithBase(id), userData),
	delete: (id) => api.delete(pathWithBase(id))
};

export default userApi;