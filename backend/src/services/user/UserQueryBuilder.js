import {IUserQueryBuilder} from "../../interfaces/user/IUserQueryBuilder.js";

/**
 * @augments IUserQueryBuilder
 * @description Concrete implementation of IUserQueryBuilder.
 */
export class UserQueryBuilder extends IUserQueryBuilder {
	buildQuery(filters) {
		const agnosticQuery = {};

		if (filters.role) agnosticQuery.role = filters.role;
		if (filters.isVerified !== undefined) agnosticQuery.isVerified = filters.isVerified;

		if (filters.search && filters.search.trim()) {
			agnosticQuery.search = filters.search.trim();
		}

		return agnosticQuery;
	}
}