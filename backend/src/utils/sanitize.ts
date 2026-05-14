export function sanitizeSearchTerm(term: string): string {
	if (!term) return "";
	return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}