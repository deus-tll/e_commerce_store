export const Slug = {
	generate(text: string): string {
		return text
			.toString()
			.trim()
			.toLowerCase()
			.replace(/['"]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");
	}
}