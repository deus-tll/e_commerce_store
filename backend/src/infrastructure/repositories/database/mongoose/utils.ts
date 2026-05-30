import {Types} from "mongoose";
import {EntityNotFoundError} from "../../../../errors/index.js";

export type SortObject = Record<string, 1 | -1>;

/**
 * Converts a Mongoose Document or a lean object into a normalized JavaScript object
 * by removing some mongoose specific fields and methods that are the same between entities.
 */
export function normalizePersistence<T extends { _id?: any; __v?: any, toObject?: (...args: any[]) => any } | null>(
    doc: T
): T extends null ? null : Omit<T, "_id" | "__v"> & { id: string } {
    if (!doc) return null;

    const normalizedObject = typeof doc.toObject === "function"
    ? doc.toObject({ getters: true, virtuals: false })
    : { ...(doc as any) };

    if (normalizedObject._id) {
        normalizedObject.id = normalizedObject._id.toString();
        delete normalizedObject._id;
    }

    delete normalizedObject["__v"];
    return normalizedObject;
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
    order: string = "desc"
): SortObject {
    const sortOrder: 1 | -1 = order === "desc" ? -1 : 1;
    return { [sortBy]: sortOrder };
}