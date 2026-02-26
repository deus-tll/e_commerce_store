import mongoose from "mongoose";
import {EntityNotFoundError} from "../../errors/index.js";

/**
 * Helper to safely cast string IDs to ObjectIds.
 * Prevents the app from crashing on malformed ID strings.
 */
export function toObjectId(id, entity) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new EntityNotFoundError(entity, { id });
	}
	return new mongoose.Types.ObjectId(id);
}

export function determineSort(sortBy = "createdAt", order = "desc") {
	const sortOrder = order === "desc" ? -1 : 1;
	return { [sortBy]: sortOrder };
}