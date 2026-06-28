import {Response} from "express";
import {ReviewService} from "../../application/review/ReviewService.js";
import {ParamsWithIdRequest} from "../requests/shared.js";
import {ReviewCreateRequest, ReviewGetAllByProductQuery, ReviewUpdateRequest} from "../requests/review.js";

export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService
	) {}

	create = async (req: ReviewCreateRequest, res: Response): Promise<Response> => {
		const { id: productId } = req.params;
		const reviewDTO = await this.reviewService.create(productId, req.user.id, req.body);

		return res.status(201).json(reviewDTO);
	}

	update = async (req: ReviewUpdateRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const reviewDTO = await this.reviewService.update(id, req.user.id, req.body);

		return res.status(200).json(reviewDTO);
	}

	delete = async (req: ParamsWithIdRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const reviewDTO = await this.reviewService.delete(req.user.id, id);

		return res.status(200).json(reviewDTO);
	}

	getAllByProduct = async (req: ParamsWithIdRequest, res: Response): Promise<Response> => {
		const { id: productId } = req.params;
		const { page, limit } = req.query as unknown as ReviewGetAllByProductQuery;

		const paginationResult = await this.reviewService.getAllByProduct(productId, page, limit);

		return res.status(200).json(paginationResult);
	}
}