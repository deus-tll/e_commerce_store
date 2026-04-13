import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/coupons");

const couponApi = {
	get: () => api.get(pathWithBase()),
	apply: (code) => api.post(pathWithBase("validate"), { code }),
};

export default couponApi;