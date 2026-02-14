/**
 * Reads a single File object and resolves with its Base64 Data URL string.
 * @param {File} file
 * @returns {Promise<string>} The Base64 Data URL string.
 */
export const readFileAsDataURL = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(/** @type {string} */ (reader.result));
		reader.onerror = () => reject(new Error("File reading failed"));
		reader.readAsDataURL(file);
	});
};

/**
 * Reads multiple File objects from a FileList and resolves with an array of
 * their Base64 Data URL strings.
 * @param {FileList | null} fileList
 * @returns {Promise<string[]>} An array of Base64 Data URL strings.
 */
export const readFilesAsDataURLs = async (fileList) => {
	const files = Array.from(fileList || []).filter(file => file instanceof File);

	if (files.length === 0) return [];

	const promises = files.map(readFileAsDataURL);

	return Promise.all(promises);
};