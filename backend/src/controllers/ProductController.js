import {ProductService} from "../services/ProductService.js";

export class ProductController {
	constructor() {
		this.productService = new ProductService();
	}

	getProducts = async (req, res, next) => {
		try {
			const { page, limit } = req.query;
			const result = await this.productService.getProducts({ page, limit });
			res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	getFeaturedProducts = async (req, res, next) => {
		try {
			const featuredProducts = await this.productService.getFeaturedProducts();
			res.status(200).json(featuredProducts);
		}
		catch (error) {
			next(error);
		}
	}

	getProductsByCategory = async (req, res, next) => {
		try {
			const { category } = req.params;
			const products = await this.productService.getProductsByCategory(category);

			res.status(200).json(products);
		}
		catch (error) {
			next(error);
		}
	}

	getRecommendedProducts = async (req, res, next) => {
		try {
			const products = await this.productService.getRecommendedProducts();
			res.status(200).json(products);
		}
		catch (error) {
			next(error);
		}
	}

	createProduct = async (req, res, next) => {
		try {
			const product = await this.productService.createProduct(req.body);
			res.status(201).json(product);
		}
		catch (error) {
			next(error);
		}
	}

	updateProduct = async (req, res, next) => {
		try {
			const { id } = req.params;
			const updated = await this.productService.updateProduct(id, req.body);
			res.status(200).json(updated);
		}
		catch (error) {
			next(error);
		}
	}

	toggleFeaturedProduct = async (req, res, next) => {
		try {
			const { id } = req.params;
			const updatedProduct = await this.productService.toggleFeaturedProduct(id);

			res.status(200).json(updatedProduct);
		}
		catch (error) {
			next(error);
		}
	}

	deleteProduct = async (req, res, next) => {
		try {
			const { id } = req.params;
			await this.productService.deleteProduct(id);

			res.status(204).end();
		}
		catch (error) {
			next(error);
		}
	}
}