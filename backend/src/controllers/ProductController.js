import {IProductService} from "../interfaces/product/IProductService.js";
import {CreateProductDTO, UpdateProductDTO} from "../domain/index.js";

import {BadRequestError} from "../errors/apiErrors.js";

/**
 * Handles incoming HTTP requests related to products, extracting request data,
 * mapping it to DTOs, and delegating business logic to the IProductService.
 */
export class ProductController {
	/** @type {IProductService} */ #productService;

	/**
	 * @param {IProductService} productService - An instance of the object that implements IProductService contract.
	 */
	constructor(productService) {
		this.#productService = productService;
	}

	/**
	 * Handles the request to create a new product. It extracts necessary data from
	 * the request body, maps it to a `CreateProductDTO`, and delegates to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects product creation data in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the created ProductDTO.
	 */
	create = async (req, res, next) => {
		try {
			// Explicitly extract all fields from req.body
			const { name, description, price, images, categoryId, isFeatured } = req.body;

			// 1. Validation (Required fields)
			if (!name || !name.trim()) throw new BadRequestError("Product name is required.");
			if (!description || !description.trim()) throw new BadRequestError("Product description is required.");
			if (!price === undefined || typeof price !== 'number' || price <= 0) throw new BadRequestError("Price must be a positive number.");
			if (!categoryId || !categoryId.trim()) throw new BadRequestError("Category ID is required.");
			if (!images || !images.mainImage) throw new BadRequestError("Main image is required.");

			// 2. Create Agnostic Creation DTO
			const creationData = new CreateProductDTO({
				name: name.trim(),
				description: description.trim(),
				price,
				images,
				categoryId: categoryId.trim(),
				isFeatured,
			});

			const result = await this.#productService.create(creationData);
			res.status(201).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Handles the request to update an existing product. It extracts partial update data
	 * from the request, maps it to an `UpdateProductDTO`, and delegates the operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params and update data in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated ProductDTO.
	 */
	update = async (req, res, next) => {
		try {
			const { id } = req.params;

			// Explicitly extract all potential update fields from req.body
			const { name, description, price, images, categoryId, isFeatured } = req.body;

			// 1. Validation and sparse object creation
			const updateFields = {};
			let hasUpdateFields = false;

			if (name !== undefined) {
				if (!name || !name.trim()) throw new BadRequestError("Product name cannot be empty.");
				updateFields.name = name.trim();
				hasUpdateFields = true;
			}
			if (description !== undefined) {
				if (!description || !description.trim()) throw new BadRequestError("Product description cannot be empty.");
				updateFields.description = description.trim();
				hasUpdateFields = true;
			}
			if (price !== undefined) {
				if (typeof price !== 'number' || price <= 0) throw new BadRequestError("Price must be a positive number.");
				updateFields.price = price;
				hasUpdateFields = true;
			}
			if (images !== undefined) {
				if (images && images.mainImage === null) throw new BadRequestError("The main image is required and cannot be set to null.");
				updateFields.images = images;
				hasUpdateFields = true;
			}
			if (categoryId !== undefined) {
				if (!categoryId || !categoryId.trim()) throw new BadRequestError("Category ID cannot be empty.");
				updateFields.categoryId = categoryId.trim();
				hasUpdateFields = true;
			}
			if (isFeatured !== undefined) {
				updateFields.isFeatured = isFeatured;
				hasUpdateFields = true;
			}

			if (!hasUpdateFields) {
				throw new BadRequestError("At least one field (name, description, price, images, categoryId, isFeatured) must be provided for update.");
			}

			// 2. Create Agnostic Update DTO
			const updateData = new UpdateProductDTO(updateFields);

			const updated = await this.#productService.update(id, updateData);
			res.status(200).json(updated);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Handles the request to toggle the 'isFeatured' status of a product by ID.
	 * It delegates the status change to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated ProductDTO.
	 */
	toggleFeatured = async (req, res, next) => {
		try {
			const { id } = req.params;
			const updated = await this.#productService.toggleFeatured(id);

			res.status(200).json(updated);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Handles the request to delete a product by ID. It delegates the deletion operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 204 (No Content).
	 */
	delete = async (req, res, next) => {
		try {
			const { id } = req.params;
			await this.#productService.delete(id);

			res.status(204).end();
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a paginated and filtered list of all products. It extracts pagination
	 * and filter parameters from the query and delegates the query to the service layer. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'page', 'limit', 'categorySlug', and 'search' in req.query.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a ProductPaginationResultDTO.
	 */
	getAll = async (req, res, next) => {
		try {
			// Extract pagination and filtering parameters
			const { page, limit, categorySlug, search } = req.query;

			// Build the agnostic filters object for the service layer
			const filters = {};
			if (categorySlug) filters.categorySlug = categorySlug;
			if (search) filters.search = search;

			const result = await this.#productService.getAll(page, limit, filters);

			res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a single product's full details by its ID, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the requested ProductDTO.
	 */
	getById = async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await this.#productService.getByIdOrFail(id);
			res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a list of featured products, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and an array of ProductDTOs.
	 */
	getFeatured = async (req, res, next) => {
		try {
			const result = await this.#productService.getFeatured();
			res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a list of recommended products, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and an array of ProductDTOs.
	 */
	getRecommended = async (req, res, next) => {
		try {
			const result = await this.#productService.getRecommended();
			res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}
}