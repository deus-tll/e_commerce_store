import {StripePaymentService} from "../services/payment/StripePaymentService.js";

export class PaymentController {
	constructor() {
		this.paymentService = new StripePaymentService();
	}

	createCheckoutSession = async (req, res, next) => {
		try {
			const { products, couponCode } = req.body;
			const userId = req.user._id;

			const sessionData = await this.paymentService.createCheckoutSession(products, couponCode, userId);

			res.status(200).json(sessionData);
		} catch (error) {
			next(error);
		}
	}

	checkoutSuccess = async (req, res, next) => {
		try {
			const { sessionId } = req.body;
			const result = await this.paymentService.checkoutSuccess(sessionId);

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}