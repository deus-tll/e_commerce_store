import {IStorageProvider} from "../providers/storage/IStorageProvider.js";

export abstract class StorageService {
    protected constructor(
        private readonly storageProvider: IStorageProvider,
        private readonly folder: string
    ) {}

    async upload(file: string): Promise<string> {
        return this.storageProvider.upload(file, this.folder);
    }

    async delete(fileUrl: string | null): Promise<void> {
        if (fileUrl) {
            return this.storageProvider.delete(fileUrl, this.folder);
        }
    }
}