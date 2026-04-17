import {IPaymentService} from "../interfaces/payment/IPaymentService.js";

/**
 * Handles incoming HTTP requests related to payment and checkout,
 * extracting request data, and delegating business logic to the IPaymentService.
 */
export class PaymentController {
	/** @type {IPaymentService} */ #paymentService;

	/**
	 * @param {IPaymentService} paymentService
	 */
	constructor(paymentService) {
		this.#paymentService = paymentService;
	}

	/**
	 * Initiates the checkout process by requesting the creation of a payment session (e.g., Stripe session etc.).
	 * Extracts validated product data and coupon code, performs product lookups, and delegates the session creation. (Authenticated).
	 * @param {object} req - Express request object. Expects 'products' (array of {id, quantity}) and optional 'couponCode' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a CheckoutSessionDTO.
	 */
	createCheckoutSession = async (req, res) => {
		const { products, couponCode, customerDetails } = req.body;
		const userId = req.userId;

		const sessionData = await this.#paymentService.createCheckoutSession(
			products,
			couponCode,
			userId,
			customerDetails
		);

		return res.status(200).json(sessionData);
	}

	handleWebhook = async (req, res) => {
		await this.#paymentService.processWebhook(req.body, req.headers);
		return res.status(200).json({ received: true });
	}
}