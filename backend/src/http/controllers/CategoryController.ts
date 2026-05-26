import {Request, Response} from "express";

import {CategoryService} from "../../application/category/CategoryService.js";
import {CategoryCreateRequest, CategoryUpdateRequest, CategoryGetAllQuery} from "../requests/category.js";
import {ParamsWithIdRequest, ParamsWithSlugRequest} from "../requests/shared.js";

export class CategoryController {
	constructor(
		private readonly categoryService: CategoryService
	) {}

	create = async (req: CategoryCreateRequest, res: Response): Promise<Response> => {
		const categoryDTO = await this.categoryService.create(req.body);
		return res.status(201).json(categoryDTO);
	}

	update = async (req: CategoryUpdateRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const categoryDTO = await this.categoryService.update(id, req.body);

		return res.status(200).json(categoryDTO);
	}

	delete = async (req: ParamsWithIdRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const categoryDTO = await this.categoryService.delete(id);

		return res.status(200).json(categoryDTO);
	}

	getAll = async (req: Request, res: Response): Promise<Response> => {
		const query = req.query as unknown as CategoryGetAllQuery;
		const { page, limit, ...filters } = query;
		const paginationResult = await this.categoryService.getAll(page, limit, filters);

		return res.status(200).json(paginationResult);
	}

	getBySlug = async (req: ParamsWithSlugRequest, res: Response): Promise<Response> => {
		const { slug } = req.params;
		const categoryDTO = await this.categoryService.getBySlugOrFail(slug);

		return res.status(200).json(categoryDTO);
	}
}