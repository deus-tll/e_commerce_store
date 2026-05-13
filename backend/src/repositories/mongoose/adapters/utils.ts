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