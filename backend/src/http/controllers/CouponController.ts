import {Request, Response} from "express";
import {CouponService} from "../../application/coupon/CouponService.js";
import {BodyWithCodeRequest} from "../requests/shared.js";

export class CouponController {
	constructor(
		private readonly couponService: CouponService
	) {}

	/**
	 * Retrieves the currently active coupon for the authenticated user, if one exists.
	 */
	get = async (req: Request, res: Response): Promise<Response> => {
		const couponDTO = await this.couponService.getActiveByUserId(req.user.id);
		return res.status(200).json(couponDTO);
	}

	/**
	 * Validates a provided coupon code against the user's eligibility and coupon rules.
	 */
	validate = async (req: BodyWithCodeRequest, res: Response): Promise<Response> => {
		const { code } = req.body;

		const validationResult = await this.couponService.validate(code, req.user.id);

		return res.status(200).json(validationResult);
	}
}