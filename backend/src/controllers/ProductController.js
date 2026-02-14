import {IProductService} from "../interfaces/product/IProductService.js";
import {CreateProductDTO, ProductAttribute, ProductImage, UpdateProductDTO} from "../domain/index.js";

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
	 * @returns {Promise<void>} - Responds with status 201 and the created ProductDTO.
	 */
	create = async (req, res) => {
		const { images, attributes, ...rest } = req.body;

		const createProductDTO = new CreateProductDTO({
			...rest,
			images: new ProductImage(images),
			attributes: attributes.map(attr => new ProductAttribute(attr))
		});
		const productDTO = await this.#productService.create(createProductDTO);

		return res.status(201).json(productDTO);
	}

	/**
	 * Handles the request to update an existing product. It extracts partial update data
	 * from the request, maps it to an `UpdateProductDTO`, and delegates the operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params and update data in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated ProductDTO.
	 */
	update = async (req, res) => {
		const { id } = req.params;
		const { images, attributes, ...rest } = req.body;

		const updatePayload = { ...rest };

		if (images) updatePayload.images = new ProductImage(images);
		if (attributes) updatePayload.attributes = attributes.map(attr => new ProductAttribute(attr));

		const updateProductDTO = new UpdateProductDTO(updatePayload);
		const productDTO = await this.#productService.update(id, updateProductDTO);

		return res.status(200).json(productDTO);
	}

	/**
	 * Handles the request to toggle the 'isFeatured' status of a product by ID.
	 * It delegates the status change to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated ProductDTO.
	 */
	toggleFeatured = async (req, res) => {
		const { id } = req.params;
		const productDTO = await this.#productService.toggleFeatured(id);

		return res.status(200).json(productDTO);
	}

	/**
	 * Handles the request to delete a product by ID. It delegates the deletion operation to the service layer. (Admin protected).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 204 (No Content).
	 */
	delete = async (req, res) => {
		const { id } = req.params;
		await this.#productService.delete(id);

		return res.status(204).end();
	}

	/**
	 * Retrieves a paginated and filtered list of all products. It extracts pagination
	 * and filter parameters from the query and delegates the query to the service layer. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'page', 'limit', 'categorySlug', and 'search' in req.query.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a ProductPaginationResultDTO.
	 */
	getAll = async (req, res) => {
		const { page, limit, ...rest } = req.query;
		const paginationResult = await this.#productService.getAll(page, limit, {...rest});

		return res.status(200).json(paginationResult);
	}

	/**
	 * Retrieves a single product's full details by its ID, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'id' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested ProductDTO.
	 */
	getById = async (req, res) => {
		const { id } = req.params;
		const productDTO = await this.#productService.getByIdOrFail(id);

		return res.status(200).json(productDTO);
	}

	/**
	 * Retrieves a list of featured products, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and an array of ProductDTOs.
	 */
	getFeatured = async (req, res) => {
		const productDTOs = await this.#productService.getFeatured();
		return res.status(200).json(productDTOs);
	}

	/**
	 * Retrieves unique attribute names and values for a specific category.
	 * Used for building dynamic filter sidebars. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'id' (category ID) in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and an array of AttributeFacetDTOs.
	 */
	getFacets = async (req, res) => {
		const { id } = req.params;
		const attributeFacetDTOs = await this.#productService.getCategoryFacets(id);

		return res.status(200).json(attributeFacetDTOs);
	}

	/**
	 * Retrieves a list of recommended products, delegating the fetch operation to the service layer. (Public endpoint).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and an array of ProductDTOs.
	 */
	getRecommended = async (req, res) => {
		const productDTOs = await this.#productService.getRecommended();
		return res.status(200).json(productDTOs);
	}
}