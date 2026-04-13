import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/analytics");

const analyticsApi = {
	get: () => api.get(pathWithBase())
};

export default analyticsApi;