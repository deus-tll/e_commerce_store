export function sanitizeSearchTerm(term) {
	if (!term) return "";
	return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}