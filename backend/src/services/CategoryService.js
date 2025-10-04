import Category from "../models/mongoose/Category.js";
import {CloudinaryStorageService} from "./storages/CloudinaryStorageService.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";
import {FileFolders} from "../utils/constants.js";
import {toSlug} from "../utils/slugify.js";

export class CategoryService {
	constructor() {
		this.storageService = new CloudinaryStorageService(FileFolders.CATEGORIES);
	}
	async #ensureUniqueSlug(baseSlug) {
		let slug = baseSlug;
		let suffix = 0;
		// Try slug, slug-1, slug-2, ... until unique
		while (await Category.exists({ slug })) {
			suffix += 1;
			slug = `${baseSlug}-${suffix}`;
		}
		return slug;
	}

	async createCategory(name, image = "", options = { isPredefined: false }) {
		if (!name || !name.trim()) {
			throw new BadRequestError("Category name is required");
		}
		
		const baseSlug = toSlug(name);
		const slug = await this.#ensureUniqueSlug(baseSlug);

		let imageUrl = "";
		if (image) {
			if (options.isPredefined) {
				imageUrl = image;
			}
			else {
				imageUrl = await this.storageService.upload(image);
			}
		}

		return Category.create({ name: name.trim(), slug, image: imageUrl });
	}

	async getBySlug(slug) {
		const doc = await Category.findOne({ slug });
		if (!doc) throw new NotFoundError("Category not found");

		return doc;
	}

	async getCategories() {
		return Category.find({}).sort({ name: 1 });
	}

	async updateCategory(categoryId, name, image) {
		const category = await Category.findById(categoryId);
		if (!category) throw new NotFoundError("Category not found");

		if (typeof name === "string" && name.trim()) {
			category.name = name.trim();
			// slug will be refreshed by model hook
		}

		if (image) {
			await this.storageService.delete(category.image);
			category.image = await this.storageService.upload(image);
		}

		return category.save();
	}

	async deleteCategory(categoryId) {
		const category = await Category.findByIdAndDelete(categoryId);
		if (!category) throw new NotFoundError("Category not found");

		await this.storageService.delete(category.image);

		return category;
	}

	async countCategories() {
		return await Category.countDocuments();
	}
}