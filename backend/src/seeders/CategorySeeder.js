import { CategoryService } from "../services/CategoryService.js";

const PORT = process.env.PORT || 3001;
const APP_URL =
	process.env.NODE_ENV !== "production"
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

export class CategorySeeder {
	constructor() {
		this.categoryService = new CategoryService();
	}

	async seed() {
		try {
			const count = await this.categoryService.countCategories();

			if (count > 0) {
				console.log("Categories already exist, skipping seeding.");
				return;
			}

			for (const category of defaultCategories) {
				await this.categoryService.createCategory(
					category.name,
					`${APP_URL}${category.image}`,
					{ isPredefined: true }
				);
			}

			console.log("Categories seeded successfully!");
		}
		catch (error) {
			console.error("Error while seeding categories:", error.message);
		}
	}
}