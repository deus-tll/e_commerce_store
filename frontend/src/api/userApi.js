import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/users");

const userApi = {
	getAll: (params) => api.get(pathWithBase(), { params }),
	getStats: () => api.get(pathWithBase(`/stats`)),

	create: (userData) => api.post(pathWithBase(), userData),
	update: (userId, userData) => api.patch(pathWithBase(userId), userData),
	delete: (userId) => api.delete(pathWithBase(userId))
};

export default userApi;