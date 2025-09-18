import { CategoryService } from "../services/CategoryService.js";

export class CategoryController {
	constructor() {
		this.categoryService = new CategoryService();
	}

	getAll = async (req, res, next) => {
		try {
			const categories = await this.categoryService.getCategories();
			res.status(200).json(categories);
		}
		catch (error) {
			next(error);
		}
	}

	create = async (req, res, next) => {
		try {
			const { name, image } = req.body;
			const category = await this.categoryService.createCategory(name, image);
			res.status(201).json(category);
		}
		catch (error) {
			next(error);
		}
	}

	update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name, image } = req.body;
			const updated = await this.categoryService.updateCategory(id, name, image);
			res.status(200).json(updated);
		}
		catch (error) {
			next(error);
		}
	}

	delete = async (req, res, next) => {
		try {
			const { id } = req.params;
			await this.categoryService.deleteCategory(id);
			res.status(204).end();
		}
		catch (error) {
			next(error);
		}
	}
}