import {ICouponService} from "../interfaces/coupon/ICouponService.js";

/**
 * Handles incoming HTTP requests related to coupon management, focusing on
 * extracting request data, mapping it to DTOs, and delegating business logic
 * to the ICouponService.
 */
export class CouponController {
	/** @type {ICouponService} */ #couponService;

	/**
	 * @param {ICouponService} couponService - An instance of the object that implements ICategoryService contract.
	 */
	constructor(couponService) {
		this.#couponService = couponService;
	}

	/**
	 * Retrieves the currently active coupon for the authenticated user, if one exists.
	 * @param {object} req - Express request object. Expects 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a CouponDTO.
	 */
	get = async (req, res, next) => {
		try {
			const userId = req.userId;

			const coupon = await this.#couponService.getActiveByUserIdOrFail(userId);

			return res.status(200).json(coupon);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Validates a provided coupon code against the user's eligibility and coupon rules.
	 * @param {object} req - Express request object. Expects a 'code' in 'req.body' and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a CouponValidationDTO.
	 */
	validate = async (req, res, next) => {
		try {
			const { code } = req.body;
			const userId = req.userId;

			const validationResult = await this.#couponService.validate(code, userId);

			return res.status(200).json(validationResult);
		}
		catch (error) {
			next(error);
		}
	}
}