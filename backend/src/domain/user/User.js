import {PaginationMetadata} from "../index.js";

/**
 * Represents the clean, database-agnostic User record (Entity).
 * This is the object returned by the Repository layer.
 */
export class UserEntity {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ email;
	/** @type {string} */ role;
	/** @type {boolean} */ isVerified;
	/** @type {Date} */ lastLogin;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/** @type {string | undefined} [password] - Only present if explicitly requested in repository call. */
	password;
	/** @type {string | undefined} */ verificationToken;
	/** @type {Date | undefined} */ verificationTokenExpiresAt;
	/** @type {string | undefined} */ resetPasswordToken;
	/** @type {Date | undefined} */ resetPasswordTokenExpiresAt;

	/**
	 * @param {object} data - Plain data object with standardized 'id' field.
	 */
	constructor(data) {
		if (!data.id) {
			throw new Error("UserEntity requires an ID.");
		}
		this.id = data.id.toString();
		this.name = data.name;
		this.email = data.email;
		this.role = data.role;
		this.isVerified = data.isVerified;
		this.lastLogin = data.lastLogin;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		// Sensitive/Internal fields
		this.password = data.password;
		this.verificationToken = data.verificationToken;
		this.verificationTokenExpiresAt = data.verificationTokenExpiresAt;
		this.resetPasswordToken = data.resetPasswordToken;
		this.resetPasswordTokenExpiresAt = data.resetPasswordTokenExpiresAt;
	}
}

/**
 * Input data class for creating a User.
 */
export class CreateUserDTO {
	/** @type {string} */ name;
	/** @type {string} */ email;
	/** @type {string} */ password;
	/** @type {string} [role] */ role;
	/** @type {boolean} [isVerified] */ isVerified;

	/**
	 * @param {object} data - Raw data for creation.
	 */
	constructor(data) {
		if (!data.name || !data.email || !data.password) {
			throw new Error("UserCreationData requires name, email, and password.");
		}

		this.name = data.name.trim();
		this.email = data.email.trim();
		this.password = data.password;
		this.role = data.role || 'customer';
		this.isVerified = !!data.isVerified;
	}
}

/**
 * Input data class for updating a User (Agnostic Input Data).
 * Allows for partial updates by only including fields that are present.
 */
export class UpdateUserDTO {
	// Public User Fields
	/** @type {string} [name] */ name;
	/** @type {string} [email] */ email;
	/** @type {string} [password] */ password;
	/** @type {string} [role] */ role;
	/** @type {boolean} [isVerified] */ isVerified;

	// Internal/Sensitive Fields used only by Service-specific methods
	/** @type {Date | undefined} [lastLogin] */ lastLogin;
	/** @type {string | undefined} [verificationToken] */ verificationToken;
	/** @type {Date | undefined} [verificationTokenExpiresAt] */ verificationTokenExpiresAt;
	/** @type {string | undefined} [resetPasswordToken] */ resetPasswordToken;
	/** @type {Date | undefined} [resetPasswordTokenExpiresAt] */ resetPasswordTokenExpiresAt;

	/**
	 * @param {object} data - Raw data for update.
	 */
	constructor(data) {
		// Public fields
		if (data.name !== undefined) this.name = data.name;
		if (data.email !== undefined) this.email = data.email;
		if (data.password !== undefined) this.password = data.password;
		if (data.role !== undefined) this.role = data.role;
		if (data.isVerified !== undefined) this.isVerified = data.isVerified;

		// Internal fields
		if (data.lastLogin !== undefined) this.lastLogin = data.lastLogin;
		if (data.verificationToken !== undefined) this.verificationToken = data.verificationToken;
		if (data.verificationTokenExpiresAt !== undefined) this.verificationTokenExpiresAt = data.verificationTokenExpiresAt;
		if (data.resetPasswordToken !== undefined) this.resetPasswordToken = data.resetPasswordToken;
		if (data.resetPasswordTokenExpiresAt !== undefined) this.resetPasswordTokenExpiresAt = data.resetPasswordTokenExpiresAt;
	}

	/**
	 * Creates a plain object containing only the fields that were provided for the update.
	 * This is useful for passing to the persistence layer (Repository).
	 * @returns {object}
	 */
	toUpdateObject() {
		const updateObject = {};

		if (this.name !== undefined) updateObject.name = this.name;
		if (this.email !== undefined) updateObject.email = this.email;
		if (this.password !== undefined) updateObject.password = this.password;
		if (this.role !== undefined) updateObject.role = this.role;
		if (this.isVerified !== undefined) updateObject.isVerified = this.isVerified;

		if (this.lastLogin !== undefined) updateObject.lastLogin = this.lastLogin;
		if (this.verificationToken !== undefined) updateObject.verificationToken = this.verificationToken;
		if (this.verificationTokenExpiresAt !== undefined) updateObject.verificationTokenExpiresAt = this.verificationTokenExpiresAt;
		if (this.resetPasswordToken !== undefined) updateObject.resetPasswordToken = this.resetPasswordToken;
		if (this.resetPasswordTokenExpiresAt !== undefined) updateObject.resetPasswordTokenExpiresAt = this.resetPasswordTokenExpiresAt;

		return updateObject;
	}
}

/**
 * Represents the public facing User data structure (DTO).
 * This is the object returned by the Service layer to controllers/clients.
 */
export class UserDTO {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ email;
	/** @type {string} */ role;
	/** @type {boolean} */ isVerified;
	/** @type {Date} */ lastLogin;
	/** @type {Date} */ createdAt;

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
		// NOTE: password, tokens, and updatedAt are excluded from the DTO
	}
}

/**
 * Represents the shortened public facing User data structure (DTO).
 * This is the object returned by the Service layer to controllers/clients or used inside other entity's DTOs.
 */
export class ShortUserDTO {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ email;

	/**
	 * @param {UserEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.email = entity.email;
	}
}

/**
 * Service-level pagination result DTO.
 */
export class UserPaginationResultDTO {
	/** @type {UserDTO[]} */ results;
	/** @type {PaginationMetadata} */ pagination;

	/**
	 * @param {UserDTO[]} results
	 * @param {PaginationMetadata} pagination
	 */
	constructor(results, pagination) {
		this.results = results;
		this.pagination = pagination;
	}
}

/**
 * Represents the User statistics data structure (DTO).
 * This is the object returned by the Service layer for the /users/stats endpoint.
 */
export class UserStatsDTO {
	/** @type {number} */ total;
	/** @type {number} */ verified;
	/** @type {number} */ unverified;
	/** @type {number} */ admins;
	/** @type {number} */ customers;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.total = data.total;
		this.verified = data.verified;
		this.unverified = data.unverified;
		this.admins = data.admins;
		this.customers = data.customers;
	}
}