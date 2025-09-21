import Product from "../models/Product.js";
import { CategoryService } from "./CategoryService.js";
import {redis} from "../config/redis.js";
import {StorageProductService} from "./storages/StorageProductService.js";
import {NotFoundError} from "../errors/apiErrors.js";


export class ProductService {
	constructor() {
		this.storageProductService = new StorageProductService();
		this.categoryService = new CategoryService();
	}

	async #updateFeaturedProductsCache() {
		try {
			const featuredProducts = await Product.find({ isFeatured: true }).lean();
			await redis.set("featured_products", JSON.stringify(featuredProducts));
		}
		catch (error) {
			console.error("Error while updating featured products cache", error.message);
		}
	}

	async getProducts() {
		return Product.find({}).populate({ path: "category", select: "name slug" });
	}

	async getProductById(productId, options = {}) {
		const { populated = false, throwIfNotFound = true } = options;

		let query = Product.findById(productId);

		if (populated) {
			query = query.populate({ path: "category", select: "name slug" });
		}

		const product = await query;

		if (!product && throwIfNotFound) {
			throw new NotFoundError("Product not found");
		}

		return product;
	}

	async getFeaturedProducts() {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return JSON.parse(featuredProducts);
		}

		featuredProducts = await Product.find({ isFeatured: true }).populate({ path: "category", select: "name slug" }).lean();
		if (!featuredProducts || featuredProducts.length === 0) {
			throw new NotFoundError("No featured products found");
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		return featuredProducts;
	}

	async getProductsByCategory(categorySlug) {
		const category = await this.categoryService.getBySlug(categorySlug);
		return Product.find({ category: category._id }).populate({ path: "category", select: "name slug" });
	}

	async getRecommendedProducts() {
		return Product.aggregate([
			{ $sample: { size: 4 } },
			{ $project: { _id: 1, name: 1, description: 1, price: 1, image: 1 } }
		]);
	}

	async createProduct(productData) {
		const { image, ...rest } = productData;
		let imageUrl = "";

		if (image) {
			imageUrl = await this.storageProductService.upload(image);
		}

		// Resolve category if provided as slug or name
		if (rest.category && typeof rest.category === "string") {
			const categoryDoc = await this.categoryService.getBySlug(rest.category).catch(async () => {
				return await this.categoryService.createCategory({ name: rest.category });
			});
			rest.category = categoryDoc._id;
		}

		return await Product.create({ ...rest, image: imageUrl });
	}

	async toggleFeaturedProduct(productId) {
		const product = await Product.findById(productId);
		if (!product) {
			throw new NotFoundError("Product not found");
		}

		product.isFeatured = !product.isFeatured;
		const updatedProduct = await product.save();

		await this.#updateFeaturedProductsCache();

		return updatedProduct;
	}

	async deleteProduct(productId) {
		const product = await Product.findByIdAndDelete(productId);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		if (product.isFeatured) {
			await this.#updateFeaturedProductsCache();
		}

		await this.storageProductService.delete(product.image);

		return product;
	}
}