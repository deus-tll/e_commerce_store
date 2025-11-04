/**
 * Represents the clean, database-agnostic Coupon record (Entity).
 * This is the object returned by the Repository layer.
 */
export class CouponEntity {
	/** @type {string} */ id;
	/** @type {string} */ code;
	/** @type {number} */ discountPercentage;
	/** @type {Date} */ expirationDate;
	/** @type {boolean} */ isActive;
	/** @type {string} */ userId;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id.toString();
		this.code = data.code;
		this.discountPercentage = data.discountPercentage;
		this.expirationDate = data.expirationDate instanceof Date ? data.expirationDate : new Date(data.expirationDate);
		this.isActive = !!data.isActive;
		this.userId = data.userId.toString();
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}

	/**
	 * Checks if the coupon is expired based on the current time.
	 * @returns {boolean}
	 */
	isExpired() {
		return this.expirationDate < new Date();
	}
}

/**
 * Agnostic class for input data when creating a Coupon.
 */
export class CreateCouponDTO {
	/** @type {string} */ code;
	/** @type {number} */ discountPercentage;
	/** @type {Date} */ expirationDate;
	/** @type {boolean} */ isActive;
	/** @type {string} */ userId;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.code = data.code.trim();
		this.discountPercentage = Number(data.discountPercentage);
		this.expirationDate = data.expirationDate instanceof Date ? data.expirationDate : new Date(data.expirationDate);
		this.isActive = data.isActive !== undefined ? data.isActive : true;
		this.userId = data.userId.toString();
	}
}

/**
 * Agnostic class for input data when updating a coupon.
 */
export class UpdateCouponDTO {
	/** @type {string} */ code;
	/** @type {string} */ userId;
	/** @type {boolean} [isActive] */ isActive;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.code = data.code;
		this.userId = data.userId;
		if (data.isActive !== undefined) this.isActive = data.isActive;
	}

	/**
	 * Returns an object containing only the fields that were explicitly
	 * provided by the caller for update.
	 * @returns {object} An object with only the fields to be updated.
	 */
	toUpdateObject() {
		const update = {};

		if (this.isActive !== undefined) {
			update.isActive = this.isActive;
		}

		return update;
	}
}

/**
 * Represents the public facing Coupon data structure (DTO).
 * This is the object returned by the Service layer to the Controller.
 */
export class CouponDTO {
	/** @type {string} */ id;
	/** @type {string} */ code;
	/** @type {number} */ discountPercentage;
	/** @type {Date} */ expirationDate;
	/** @type {boolean} */ isActive;
	/** @type {string} */ userId;

	/**
	 * @param {CouponEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.code = entity.code;
		this.discountPercentage = entity.discountPercentage;
		this.expirationDate = entity.expirationDate;
		this.isActive = entity.isActive;
		this.userId = entity.userId;
	}
}

/**
 * Output data class for coupon validation results.
 */
export class CouponValidationDTO {
	/** @type {string} */ message;
	/** @type {string} */ code;
	/** @type {number} */ discountPercentage;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.message = data.message;
		this.code = data.code;
		this.discountPercentage = data.discountPercentage;
	}
}