export abstract class IStorageProvider {
	/**
	 * @returns The secure, publicly accessible URL of the uploaded file.
	 */
	abstract upload(file: string, folder: string): Promise<string>;
	abstract delete(fileUrl: string | null, folder: string): Promise<void>;
	abstract deleteAll(): Promise<void>;
}