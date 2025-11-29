import {IPaymentService} from "../interfaces/payment/IPaymentService.js";
import {IProductService} from "../interfaces/product/IProductService.js";
import {OrderProductItem} from "../domain/index.js";

import {NotFoundError} from "../errors/apiErrors.js";

/**
 * Handles incoming HTTP requests related to payment and checkout,
 * extracting request data, and delegating business logic to the IPaymentService.
 */
export class PaymentController {
	/** @type {IPaymentService} */ #paymentService;
	/** @type {IProductService} */ #productService;

	/**
	 * @param {IPaymentService} paymentService
	 * @param {IProductService} productService
	 */
	constructor(paymentService, productService) {
		this.#paymentService = paymentService;
		this.#productService = productService;
	}

	/**
	 * Initiates the checkout process by requesting the creation of a payment session (e.g., Stripe session etc.).
	 * Extracts validated product data and coupon code, performs product lookups, and delegates the session creation. (Authenticated).
	 * @param {object} req - Express request object. Expects 'products' (array of {id, quantity}) and optional 'couponCode' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a CheckoutSessionDTO.
	 */
	createCheckoutSession = async (req, res, next) => {
		try {
			const { products, couponCode } = req.body;
			const userId = req.userId;

			const productIds = products.map(p => p.id);
			const shortProducts = await this.#productService.getShortDTOsByIds(productIds);

			if (shortProducts.length !== productIds.length) {
				throw new NotFoundError("One or more products not found.");
			}

			const orderItems = shortProducts.map((p) => {
				const clientProduct = products.find((cp) => cp.id === p.id);
				const quantity = clientProduct.quantity;

				return new OrderProductItem({
					id: p.id,
					quantity,
					price: p.price,
					name: p.name,
					image: p.image
				});
			});

			const sessionData = await this.#paymentService.createCheckoutSession(
				orderItems,
				couponCode,
				userId
			);

			return res.status(200).json(sessionData);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Handles the webhook or client redirect after a successful payment, verifying the payment status
	 * and creating the final order. Extracts the session ID and delegates the success logic.
	 * @param {object} req - Express request object. Expects 'sessionId' in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a CheckoutSuccessDTO.
	 */
	checkoutSuccess = async (req, res, next) => {
		try {
			const { sessionId } = req.body;

			const result = await this.#paymentService.checkoutSuccess(sessionId);

			return res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}