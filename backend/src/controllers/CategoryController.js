import { ICategoryService } from "../interfaces/category/ICategoryService.js";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../domain/index.js";

/**
 * Handles incoming HTTP requests related to category management, focusing on
 * extracting request data, mapping it to DTOs, and delegating business logic
 * to the ICategoryService.
 */
export class CategoryController {
	/** @type {ICategoryService} */ #categoryService;

	/**
	 * @param {ICategoryService} categoryService - An instance of the object that implements ICategoryService contract.
	 */
	constructor(categoryService) {
		this.#categoryService = categoryService;
	}

	/**
	 * Creates a new product category using data from the request body.
	 * Extracts name and image, maps to a DTO, and delegates creation to the service. (Admin-only).
	 * @param {object} req - Express request object. Expects 'name' and 'image' in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the created CategoryDTO.
	 */
	create = async (req, res, next) => {
		try {
			const { name, image } = req.body;

			const creationData = new CreateCategoryDTO({ name, image });
			const createdCategoryDTO = await this.#categoryService.create(creationData);

			return res.status(201).json(createdCategoryDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an existing category's details (name, image).
	 * Extracts the category ID from params, update data from body, maps to a DTO, and delegates. (Admin-only).
	 * @param {object} req - Express request object. Expects 'id' in req.params and update fields in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated CategoryDTO.
	 */
	update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name, image } = req.body;

			const updateCategoryDTO = new UpdateCategoryDTO({ name, image });
			const updatedCategoryDTO = await this.#categoryService.update(id, updateCategoryDTO);

			return res.status(200).json(updatedCategoryDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes a category by its ID. Extracts the ID and delegates. (Admin-only).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the deleted CategoryDTO.
	 */
	delete = async (req, res, next) => {
		try {
			const { id } = req.params;

			const deletedCategoryDTO = await this.#categoryService.delete(id);

			return res.status(200).json(deletedCategoryDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a paginated list of all categories. Extracts optional page and limit query parameters. (Public).
	 * @param {object} req - Express request object. Expects optional 'page' and 'limit' in req.query.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a CategoryPaginationResultDTO.
	 */
	getAll = async (req, res, next) => {
		try {
			const { page, limit } = req.query;

			const categories = await this.#categoryService.getAll(page, limit);

			return res.status(200).json(categories);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a single category by its ID. Extracts the ID and delegates. (Public).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the CategoryDTO.
	 */
	getById = async (req, res, next) => {
		try {
			const { id } = req.params;

			const categoryDTO = await this.#categoryService.getById(id);

			return res.status(200).json(categoryDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a single category by its slug. Extracts the slug and delegates. (Public).
	 * @param {object} req - Express request object. Expects 'slug' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the CategoryDTO.
	 */
	getBySlug = async (req, res, next) => {
		try {
			const { slug } = req.params;

			const categoryDTO = await this.#categoryService.getBySlug(slug);

			return res.status(200).json(categoryDTO);
		}
		catch (error) {
			next(error);
		}
	}
}