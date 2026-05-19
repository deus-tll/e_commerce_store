export class UserQueryParser {
	parse(filters, context = {}) {
		const query = {};

		if (filters.role) query.role = filters.role;
		if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;

		const search = filters.search?.trim();
		if (search) query.search = search;

		return query;
	}
}