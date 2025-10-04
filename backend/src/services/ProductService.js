import Product from "../models/mongoose/Product.js";
import {CategoryService} from "./CategoryService.js";
import {redis} from "../config/redis.js";
import {InternalServerError, NotFoundError} from "../errors/apiErrors.js";
import {CloudinaryStorageService} from "./storages/CloudinaryStorageService.js";
import {FileFolders} from "../utils/constants.js";


export class ProductService {
	constructor() {
		this.storageService = new CloudinaryStorageService(FileFolders.PRODUCTS);
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

    async getProducts(page = 1, limit = 10, filters = {}) {
        const numericPage = Math.max(parseInt(page, 10) || 1, 1);
        const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

        const total = await Product.countDocuments(filters);
        const pages = Math.max(Math.ceil(total / numericLimit), 1);
        const currentPage = Math.min(numericPage, pages);
        const skip = (currentPage - 1) * numericLimit;

        const products = await Product.find(filters)
            .populate({ path: "category", select: "name slug" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(numericLimit)
            .lean();

        return {
            products,
            pagination: {
                total,
                page: currentPage,
                pages,
                limit: numericLimit
            }
        };
    }

	async getProductsByIds(productIds) {
		return Product.find({ _id: { $in: productIds } });
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
			{ $project: { _id: 1, name: 1, description: 1, price: 1, images: 1 } }
		]);
	}

	async createProduct(productData) {
		const { images: inputImages, ...rest } = productData;

		let productImages = { mainImage: "", additionalImages: [] };

		if (inputImages?.mainImage) {
			productImages.mainImage = await this.storageService.upload(inputImages.mainImage);
		}

		if (Array.isArray(inputImages?.additionalImages) && inputImages.additionalImages.length > 0) {
			productImages.additionalImages = await Promise.all(
				inputImages.additionalImages.map(base64Image =>
					this.storageService.upload(base64Image)
				)
			);
		}

		// Resolve category if provided as slug or name
		if (rest.category && typeof rest.category === "string") {
			const categoryDoc = await this.categoryService.getBySlug(rest.category).catch(async () => {
				return await this.categoryService.createCategory(rest.category);
			});
			rest.category = categoryDoc._id;
		}

		const product = await Product.create({ ...rest, images: productImages });

		const populatedProduct = await this.getProductById(product._id, {
			populated: true,
			throwIfNotFound: false
		});

		if (!populatedProduct) {
			throw new InternalServerError("Failed to retrieve created product after saving.");
		}

		return populatedProduct;
	}

    async updateProduct(productId, productData) {
	    const { images: newImages, category, ...rest } = productData;

        const update = { ...rest };

        // If category provided as slug or id
        if (typeof category === "string" && category.trim() !== "") {
            try {
                const categoryDoc = await this.categoryService.getBySlug(category);
                update.category = categoryDoc._id;
            } catch (_) {
                const createdCategory = await this.categoryService.createCategory(category);
                update.category = createdCategory._id;
            }
        } else if (category) {
            update.category = category;
        }

        // If image is a base64 data URL, upload and replace
        if (newImages) {
	        if (newImages.mainImage && typeof newImages.mainImage === "string" && newImages.mainImage.startsWith("data:")) {
		        const imageUrl = await this.storageService.upload(newImages.mainImage);
		        update['images.mainImage'] = imageUrl;
	        }
	        else if (newImages.mainImage !== undefined && typeof newImages.mainImage === "string") {
		        update['images.mainImage'] = newImages.mainImage;
	        }

	        if (Array.isArray(newImages.additionalImages)) {
		        const uploadedUrls = [];

		        for (const image of newImages.additionalImages) {
			        if (typeof image === "string" && image.startsWith("data:")) {
				        const url = await this.storageService.upload(image);
				        uploadedUrls.push(url);
			        }
			        else if (typeof image === "string") {
				        uploadedUrls.push(image);
			        }
		        }

		        update['images.additionalImages'] = uploadedUrls;
	        }
        }

        const updated = await Product.findByIdAndUpdate(productId, { $set: update }, { new: true })
            .populate({ path: "category", select: "name slug" });

        if (!updated) {
            throw new NotFoundError("Product not found");
        }

        return updated;
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

		if (product.images) {
			await this.storageService.delete(product.images.mainImage);

			if (Array.isArray(product.images.additionalImages)) {
				await Promise.all(
					product.images.additionalImages.map(url => this.storageService.delete(url))
				);
			}
		}

		return product;
	}
}