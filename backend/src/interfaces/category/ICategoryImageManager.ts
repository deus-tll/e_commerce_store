/**
 * Abstract contract for Category image management operations.
 */
export abstract class ICategoryImageManager {
	/**
	 * Manages image state: uploads new, deletes old, or retains existing data.
	 */
	abstract imageDataUploadOnCreateUpdate(
		newImageData: string,
		existingImageData: string | null
	): Promise<string>;

	abstract deleteByUrl(url: string): Promise<void>;
}