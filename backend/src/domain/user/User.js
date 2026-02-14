import {PaginationMetadata} from "../index.js";
import {UserRoles} from "../../constants/app.js";

/**
 * Represents the clean, database-agnostic User record (Entity).
 * This is the object returned by the Repository layer.
 */
export class UserEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ email;
	/** @type {string} @readonly */ role;
	/** @type {boolean} @readonly */ isVerified;
	/** @type {Date} @readonly */ lastLogin;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/** @type {string | undefined} */ #password;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.email = data.email;
		this.role = data.role;
		this.isVerified = !!data.isVerified;
		this.lastLogin = data.lastLogin;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		this.#password = data.password;

		Object.freeze(this);
	}

	get hashedPassword() { return this.#password; }
}

/**
 * Input data class for creating a User.
 */
export class CreateUserDTO {
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ email;
	/** @type {string} @readonly */ password;
	/** @type {string} @readonly */ role;
	/** @type {boolean} @readonly */ isVerified;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.name = data.name;
		this.email = data.email;
		this.password = data.password;
		this.role = data.role;
		this.isVerified = !!data.isVerified;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			name: this.name,
			email: this.email,
			role: this.role,
			isVerified: this.isVerified
		});
	}
}

/**
 * Input data class for updating a User (Agnostic Input Data).
 * Allows for partial updates by only including fields that are present.
 */
export class UpdateUserDTO {
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ email;
	/** @type {string} @readonly */ role;
	/** @type {boolean} @readonly */ isVerified;

	/**
	 * @param {Object} data
	 */
	constructor(data) {
		if (data.name !== undefined) this.name = data.name;
		if (data.email !== undefined) this.email = data.email;
		if (data.role !== undefined) this.role = data.role;
		if (data.isVerified !== undefined) this.isVerified = !!data.isVerified;

		Object.freeze(this);
	}

	/**
	 * Creates a plain object containing only the fields that were provided for the update.
	 * @param {UserRoles} [requesterRole]
	 * @returns {Object}
	 */
	toPersistence(requesterRole = UserRoles.CUSTOMER) {
		const data = {};

		if (this.name !== undefined) data.name = this.name;
		if (this.email !== undefined) data.email = this.email;

		if (requesterRole === UserRoles.ADMIN) {
			if (this.role !== undefined) data.role = this.role;
			if (this.isVerified !== undefined) data.isVerified = this.isVerified;
		}

		return Object.freeze(data);
	}
}

/**
 * Represents the public facing User data structure (DTO).
 * This is the object returned by the Service layer to controllers/clients.
 */
export class UserDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ email;
	/** @type {string} @readonly */ role;
	/** @type {boolean} @readonly */ isVerified;
	/** @type {Date} @readonly */ lastLogin;
	/** @type {Date} @readonly */ createdAt;

	/**
	 * @param {UserEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.email = entity.email;
		this.role = entity.role;
		this.isVerified = entity.isVerified;
		this.lastLogin = entity.lastLogin;
		this.createdAt = entity.createdAt;

		Object.freeze(this);
	}
}

/**
 * Represents the shortened public facing User data structure (DTO).
 * This is the object returned by the Service layer to controllers/clients or used inside other entity's DTOs.
 */
export class ShortUserDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ email;

	/**
	 * @param {UserEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.email = entity.email;

		Object.freeze(this);
	}
}

/**
 * Service-level pagination result DTO.
 */
export class UserPaginationResultDTO {
	/** @type {UserDTO[]} @readonly */ users;
	/** @type {PaginationMetadata} @readonly */ pagination;

	/**
	 * @param {UserDTO[]} users
	 * @param {PaginationMetadata} pagination
	 */
	constructor(users, pagination) {
		this.users = Object.freeze([...users]);
		this.pagination = pagination;

		Object.freeze(this);
	}
}

/**
 * Represents the User statistics data structure (DTO).
 * This is the object returned by the Service layer for the /users/stats endpoint.
 */
export class UserStatsDTO {
	/** @type {number} @readonly */ total;
	/** @type {number} @readonly */ verified;
	/** @type {number} @readonly */ unverified;
	/** @type {number} @readonly */ admins;
	/** @type {number} @readonly */ customers;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.total = data.total;
		this.verified = data.verified;
		this.unverified = data.unverified;
		this.admins = data.admins;
		this.customers = data.customers;

		Object.freeze(this);
	}
}