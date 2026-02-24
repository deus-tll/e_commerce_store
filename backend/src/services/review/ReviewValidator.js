import {IReviewValidator} from "../../interfaces/review/IReviewValidator.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";

/**
 * @augments IReviewValidator
 * @description Concrete implementation of IReviewValidator.
 */
export class ReviewValidator extends IReviewValidator {
	/** @type {IProductService} */ #productService;
	/** @type {IUserService} */ #userService;

	/**
	 * @param {IProductService} productService
	 * @param {IUserService} userService
	 */
	constructor(productService, userService) {
		super();
		this.#productService = productService;
		this.#userService = userService;
	}

	async validateCreation(productId, userId) {
		await Promise.all(/** @type {Promise<any>[]} */([
			this.#productService.getByIdOrFail(productId),
			this.#userService.getByIdOrFail(userId),
		]));
	}

	async validateProductExistence(productId) {
		await this.#productService.getByIdOrFail(productId);
	}
}