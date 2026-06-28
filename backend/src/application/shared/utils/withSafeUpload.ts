import {StorageService} from "../../../infrastructure/storage/StorageService.js";

export type ImageTracker = (rawImage: string) => Promise<string>;

/**
 * Executes process of uploading files and guarantees auto-cleanup
 * of already uploaded files in case any error occurs during operation.
 *
 * Higher-order utility function that implements Execute Around Pattern.
 */
export async function withSafeUpload<T>(
    storageService: StorageService,
    operation: (track: ImageTracker) => Promise<T>
): Promise<T> {
    const uploadedUrls: string[] = [];

    const track: ImageTracker = async (rawImage: string): Promise<string> => {
        const url = await storageService.upload(rawImage);
        uploadedUrls.push(url);
        return url;
    }

    try {
        return await operation(track);
    }
    catch (error) {
        if (uploadedUrls.length > 0) {
            await Promise.allSettled(
                uploadedUrls.map(url => storageService.delete(url))
            ).catch(err =>
                console.error("[Storage Cleanup] Critical failure during automatic rollback:", err)
            );
        }

        throw error;
    }
}