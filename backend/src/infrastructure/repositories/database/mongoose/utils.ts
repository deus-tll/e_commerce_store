import { Types } from "mongoose";
import {EntityNotFoundError} from "../../../../errors/index.js";

export type SortObject = Record<string, 1 | -1>;

/**
 * Converts a Mongoose Document or a lean object into a plain JavaScript object.
 */
export function toPlainObject(doc: any): any {
    if (!doc) return null;

    const plainObject = typeof doc.toObject === "function"
    ? doc.toObject({ getters: true, virtuals: false })
    : { ...doc };

    if (plainObject._id) {
        plainObject.id = plainObject._id.toString();
        delete plainObject._id;
    }

    delete plainObject["__v"];
    return plainObject;
}

/**
 * Helper to safely cast string IDs to ObjectIds.
 * Prevents the app from crashing on malformed ID strings.
 */
export function toObjectId(id: string, entity: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
        throw new EntityNotFoundError(entity, { id });
    }
    return new Types.ObjectId(id);
}

export function determineSort(
    sortBy: string = "createdAt",
    order: "desc" | "asc" = "desc"
): SortObject {
    const sortOrder: 1 | -1 = order === "desc" ? -1 : 1;
    return { [sortBy]: sortOrder };
}