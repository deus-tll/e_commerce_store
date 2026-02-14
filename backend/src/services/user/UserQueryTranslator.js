import {IUserQueryTranslator} from "../../interfaces/user/IUserQueryTranslator.js";

/**
 * @augments IUserQueryTranslator
 * @description Concrete implementation of IUserQueryTranslator.
 */
export class UserQueryTranslator extends IUserQueryTranslator {
	translate(filters) {
		const agnosticQuery = {};

		if (filters.role) agnosticQuery.role = filters.role;
		if (filters.isVerified !== undefined) agnosticQuery.isVerified = filters.isVerified;

		const filtersSearch = filters.search?.trim();
		if (filtersSearch) {
			agnosticQuery.search = filtersSearch;
		}

		return agnosticQuery;
	}
}