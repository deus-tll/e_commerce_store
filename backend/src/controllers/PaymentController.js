import {PaymentService} from "../services/PaymentService.js";

export class PaymentController {
	constructor() {
		this.paymentService = new PaymentService();
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