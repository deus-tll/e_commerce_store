import {Request, Response} from "express";

import {CheckoutService} from "../../application/checkout/CheckoutService.js";
import {CustomerDetails} from "../../entities/order/types/CustomerDetails.js";
import {CheckoutRequest} from "../requests/payment.js";

export class PaymentController {
	constructor(
		private readonly checkoutService: CheckoutService
	) {}

	checkout = async (req: CheckoutRequest, res: Response): Promise<Response> => {
		const { customerDetails, items, couponCode } = req.body;

		const checkoutSessionDTO = await this.checkoutService.checkout(
			req.user.id,
			new CustomerDetails(customerDetails),
			items,
			couponCode,
		);

		return res.status(200).json(checkoutSessionDTO);
	}

	webhook = async (req: Request, res: Response): Promise<Response> => {
		await this.checkoutService.webhook(req.body, req.headers);
		return res.status(200).json({ received: true });
	}
}