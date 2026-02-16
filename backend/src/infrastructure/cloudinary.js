import { v2 as cloudinary } from "cloudinary";
import {config} from "../config.js";

cloudinary.config({
	cloud_name: config.storage.cloudName,
	api_key: config.storage.apiKey,
	api_secret: config.storage.apiSecret,
});

export default cloudinary;