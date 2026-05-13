import {Response} from "express";

import {ICategoryService} from "../interfaces/category/ICategoryService.js";
import {CreateCategoryDTO, UpdateCategoryDTO} from "../domain/index.js";
import {
	CreateRequest,
	UpdateRequest,
	DeleteRequest,
	GetAllRequest, GetBySlugRequest,

} from "../http/requests/categoryRequests.js";

export class CategoryController {
	private readonly categoryService: ICategoryService;

	constructor(categoryService: ICategoryService) {
		this.categoryService = categoryService;
	}

	create = async (req: CreateRequest, res: Response): Promise<Response> => {
		const createCategoryDTO = new CreateCategoryDTO(req.body);
		const categoryDTO = await this.categoryService.create(createCategoryDTO);

		return res.status(201).json(categoryDTO);
	}

	update = async (req: UpdateRequest, res: Response): Promise<Response> => {
		const { id } = req.params;

		const updateCategoryDTO = new UpdateCategoryDTO(req.body);
		const categoryDTO = await this.categoryService.update(id, updateCategoryDTO);

		return res.status(200).json(categoryDTO);
	}

	delete = async (req: DeleteRequest, res: Response): Promise<Response> => {
		const { id } = req.params;
		const categoryDTO = await this.categoryService.delete(id);

		return res.status(200).json(categoryDTO);
	}

	getAll = async (req: GetAllRequest, res: Response): Promise<Response> => {
		const { page, limit, ...filters } = req.query;
		const result = await this.categoryService.getAll(
			page,
			limit,
			{ ...filters }
		);

		return res.status(200).json(result);
	}

	getBySlug = async (req: GetBySlugRequest, res: Response): Promise<Response> => {
		const { slug } = req.params;
		const categoryDTO = await this.categoryService.getBySlugOrFail(slug);

		return res.status(200).json(categoryDTO);
	}
}