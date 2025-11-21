import {ICategoryService} from "../interfaces/category/ICategoryService.js";
import {BaseSeeder} from "./BaseSeeder.js";

import {EnvModes} from "../constants/app.js";
import {CreateCategoryDTO} from "../domain/index.js";

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || EnvModes.DEV;
const APP_URL =
	NODE_ENV !== EnvModes.PROD
		? `http://localhost:${PORT}`
		: process.env.APP_URL;

const defaultCategories = [
	{ name: "Bags", image: "/public/categories/bags.jpg" },
	{ name: "Glasses", image: "/public/categories/glasses.png" },
	{ name: "Jackets", image: "/public/categories/jackets.jpg" },
	{ name: "Jeans", image: "/public/categories/jeans.jpg" },
	{ name: "Shoes", image: "/public/categories/shoes.jpg" },
	{ name: "Suits", image: "/public/categories/suits.jpg" },
	{ name: "T-Shirts", image: "/public/categories/tshirts.jpg" },
];

export class CategorySeeder extends BaseSeeder {
	/** @type {ICategoryService} */ #categoryService;

	/**
	 * @param {ICategoryService} categoryService
	 */
	constructor(categoryService) {
		super();
		this.#categoryService = categoryService;
	}

	async seed() {
		try {
			const categoryPaginationResultDTO = await this.#categoryService.getAll(1, 1);

			if (categoryPaginationResultDTO.pagination.total > 0) {
				console.log("Categories already exist, skipping seeding.");
				return;
			}

			for (const category of defaultCategories) {
				const createCategoryDTO = new CreateCategoryDTO({
					name: category.name,
					image: `${APP_URL}${category.image}`
				});

				await this.#categoryService.create(createCategoryDTO);
			}

			console.log("Categories seeded successfully!");
		}
		catch (error) {
			console.error("Error while seeding categories:", error.message);
		}
	}
}