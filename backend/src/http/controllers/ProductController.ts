import {Request, Response} from "express";

import {ProductService} from "../../application/product/ProductService.js";
import {CartService} from "../../application/cart/CartService.js";
import {CreateProductDTO, GetAllProductsQuery, UpdateProductDTO} from "../../application/dtos/product.dto.js";

export class ProductController {
	private readonly productService: ProductService;
	private readonly cartService: CartService;

	constructor(productService: ProductService, cartService: CartService) {
		this.productService = productService;
		this.cartService = cartService;
	}

	create = async (req: Request<{}, {}, CreateProductDTO>, res: Response): Promise<Response> => {
		const productDTO = await this.productService.create(req.body);
		return res.status(201).json(productDTO);
	}

	update = async (req: Request<{ id: string }, {}, UpdateProductDTO>, res: Response): Promise<Response> => {
		const { id } = req.params;
		const productDTO = await this.productService.update(id, req.body);

		return res.status(200).json(productDTO);
	}

	toggleFeatured = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<Response> => {
		const { id } = req.params;
		const productDTO = await this.productService.toggleFeatured(id);

		return res.status(200).json(productDTO);
	}

	delete = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<Response> => {
		const { id } = req.params;
		await this.productService.delete(id);

		return res.status(204).end();
	}

	getAll = async (req: Request, res: Response): Promise<Response> => {
		const query = req.query as unknown as GetAllProductsQuery;
		const { page, limit, ...filters } = query;
		const paginationResult = await this.productService.getAll(page, limit, filters);

		return res.status(200).json(paginationResult);
	}

	getById = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<Response> => {
		const { id } = req.params;
		const productDTO = await this.productService.getByIdOrFail(id);

		return res.status(200).json(productDTO);
	}

	getFeatured = async (_: any, res: Response): Promise<Response> => {
		const productDTOs = await this.productService.getFeatured();
		return res.status(200).json(productDTOs);
	}

	/**
	 * Retrieves unique attribute names and values for a specific category.
	 * Used for building dynamic filter sidebars.
	 */
	getFacets = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<Response> => {
		const { id } = req.params;
		const attributeFacetDTOs = await this.productService.getCategoryFacets(id);

		return res.status(200).json(attributeFacetDTOs);
	}

	/**
	 * Retrieves a list of recommended products based on a current cart items.
	 */
	getRecommended = async (req: Request, res: Response): Promise<Response> => {
		let categoryIds = [];
		let excludedProductIds = [];

		const cartItems = await this.cartService.getCartItems(req.user.id);
		if (cartItems.length > 0) {
			categoryIds = [...new Set(cartItems.map(item => item.product.categoryId))];
			excludedProductIds = cartItems.map(item => item.product.id);
		}

		const productDTOs = await this.productService.getRecommended(categoryIds, excludedProductIds);

		return res.status(200).json(productDTOs);
	}
}