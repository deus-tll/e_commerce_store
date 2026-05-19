import {ICheckoutService} from "../../interfaces/order/ICheckoutService.js";
import {ClientProductDTO, CustomerDetails} from "../../domain/index.js";

/**
 * Handles incoming HTTP requests related to payment and checkout,
 * extracting request data, and delegating business logic to the IPaymentService.
 */
export class PaymentController {
	/** @type {ICheckoutService} */ #checkoutService;

	/**
	 * @param {ICheckoutService} checkoutService
	 */
	constructor(checkoutService) {
		this.#checkoutService = checkoutService;
	}

	/**
	 * Initiates the checkout process by requesting the creation of a payment session (e.g., Stripe session etc.).
	 * Extracts validated product data and coupon code, performs product lookups, and delegates the session creation. (Authenticated).
	 * @param {object} req - Express request object. Expects 'products' (array of {id, quantity}) and optional 'couponCode' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a CheckoutSessionDTO.
	 */
	checkout = async (req, res) => {
		const { products, couponCode, customerDetails } = req.body;
		const userId = req.userId;

		const checkoutSessionDTO = await this.#checkoutService.checkout(
			userId,
			new CustomerDetails(customerDetails),
			products.map(p => new ClientProductDTO(p.id, p.quantity)),
			couponCode,
		);

		return res.status(200).json(checkoutSessionDTO);
	}

	webhook = async (req, res) => {
		await this.#checkoutService.webhook(req.body, req.headers);
		return res.status(200).json({ received: true });
	}
}