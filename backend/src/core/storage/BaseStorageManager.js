/**
 * @abstract
 * Base class for domain-specific storage management.
 */
export class BaseStorageManager {
    /** @type {IStorageProvider} @protected */
    _storageProvider;
    /** @type {string} @protected */
    _folder;

    /**
     * @param {IStorageProvider} storageProvider
     * @param {string} folder - Target folder in the storage.
     */
    constructor(storageProvider, folder) {
        this._storageProvider = storageProvider;
        this._folder = folder;
    }

    async upload(file) {
        return this._storageProvider.upload(file, this._folder);
    }

    async delete(fileUrl) {
        if (fileUrl) {
            return this._storageProvider.delete(fileUrl, this._folder);
        }
    }
}