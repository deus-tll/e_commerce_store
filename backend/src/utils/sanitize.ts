export function sanitizeSearchTerm(term: string): string {
	if (!term) return "";
	const result = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return result.trim();
}