import {Request, Response} from "express";

import {OrderService} from "../../application/order/OrderService.js";
import {ForbiddenError} from "../../errors/index.js";

import {OrderStatus, UserRole} from "../../enums/application.js";
import {ParamsWithIdRequest} from "../requests/shared.js";
import {
	OrderGetAllMineQuery,
	OrderGetAllQuery,
	OrderUpdateStatusRequest,
	ParamsWithOrderNumberRequest, ParamsWithSessionIdRequest
} from "../requests/order.js";

export class OrderController {
	constructor(
		private readonly orderService: OrderService
	) {}

	updateStatus = async (req: OrderUpdateStatusRequest, res: Response) => {
		const { id } = req.params;
		const { status } = req.body;

		const orderDTO = await this.orderService.updateStatus(id, status);

		return res.status(200).json(orderDTO);
	}

	getAll = async (req: Request, res: Response) => {
		const query = req.query as unknown as OrderGetAllQuery;
		const { page, limit, ...filters } = query;
		const paginationResult = await this.orderService.getAll(page, limit, filters);

		return res.status(200).json(paginationResult);
	}

	getById = async (req: ParamsWithIdRequest, res: Response) => {
		const { id } = req.params;
		const { id: userId, role } = req.user;

		const orderDTO = role === UserRole.ADMIN
			? await this.orderService.getByIdOrFail(id)
			: await this.orderService.getByIdAndUserOrFail(id, userId);

		return res.status(200).json(orderDTO);
	}

	getAllMine = async (req: Request, res: Response) => {
		const query = req.query as unknown as OrderGetAllMineQuery;
		const { page, limit, ...rest } = query;
		const paginationResult = await this.orderService.getAll(page, limit, { ...rest, userId: req.user.id });

		return res.status(200).json(paginationResult);
	}

	getByOrderNumber = async (req: ParamsWithOrderNumberRequest, res: Response) => {
		const { orderNumber } = req.params;
		const orderDTO = await this.orderService.getByOrderNumberOrFail(orderNumber);

		return res.status(200).json(orderDTO);
	}

	getByPaymentSessionId = async (req: ParamsWithSessionIdRequest, res: Response) => {
		const { sessionId } = req.params;
		const orderDTO = await this.orderService.getByPaymentSessionIdOrFail(sessionId);

		return res.status(200).json(orderDTO);
	}

	/**
	 * Retrieves the payment status of an order by the provider's session ID.
	 * Used for frontend polling after redirect from a payment gateway.
	 * Accessible only by the owner of the order.
	 */
	getPaymentStatus = async (req: ParamsWithSessionIdRequest, res: Response) => {
		const { sessionId } = req.params;

		const order = await this.orderService.getByPaymentSessionIdOrFail(sessionId);

		if (order.user.id !== req.user.id) {
			throw new ForbiddenError("You do not have access to this information.");
		}

		return res.status(200).json({
			isPaid: order.status !== OrderStatus.AWAITING_PAYMENT,
			orderNumber: order.orderNumber,
			status: order.status
		});
	}
}