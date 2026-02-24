import { v2 as cloudinary } from "cloudinary";
import {config} from "../config.js";

cloudinary.config({
	cloud_name: config.services.storage.cloudName,
	api_key: config.services.storage.apiKey,
	api_secret: config.services.storage.apiSecret,
});

export default cloudinary;