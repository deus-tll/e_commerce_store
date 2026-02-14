/**
 * Represents the clean, database-agnostic Coupon record (Entity).
 * This is the object returned by the Repository layer.
 */
export class CouponEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ code;
	/** @type {number} @readonly */ discountPercentage;
	/** @type {Date} @readonly */ expirationDate;
	/** @type {boolean} @readonly */ isActive;
	/** @type {string} @readonly */ userId;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.code = data.code;
		this.discountPercentage = data.discountPercentage;
		this.expirationDate = data.expirationDate;
		this.isActive = !!data.isActive;
		this.userId = data.userId;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
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
	/** @type {string} @readonly */ code;
	/** @type {number} @readonly */ discountPercentage;
	/** @type {Date} @readonly */ expirationDate;
	/** @type {boolean} @readonly */ isActive;
	/** @type {string} @readonly */ userId;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.code = data.code;
		this.discountPercentage = data.discountPercentage;
		this.expirationDate = data.expirationDate;
		this.isActive = !!data.isActive;
		this.userId = data.userId;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			code: this.code,
			discountPercentage: this.discountPercentage,
			expirationDate: this.expirationDate,
			isActive: this.isActive,
			userId: this.userId
		});
	}
}

/**
 * Represents the public facing Coupon data structure (DTO).
 * This is the object returned by the Service layer to the Controller.
 */
export class CouponDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ code;
	/** @type {number} @readonly */ discountPercentage;
	/** @type {Date} @readonly */ expirationDate;
	/** @type {boolean} @readonly */ isActive;
	/** @type {string} @readonly */ userId;

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

		Object.freeze(this);
	}
}

/**
 * Output data class for coupon validation results.
 */
export class CouponValidationDTO {
	/** @type {string} @readonly */ message;
	/** @type {string} @readonly */ code;
	/** @type {number} @readonly */ discountPercentage;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.message = data.message;
		this.code = data.code;
		this.discountPercentage = data.discountPercentage;

		Object.freeze(this);
	}
}