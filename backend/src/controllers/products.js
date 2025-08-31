import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import {redis} from "../config/redis.js";
import {FileFolders} from "../utils/constants.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});

		return res.status(200).json(products);
	}
	catch (error) {
		console.error("Error while getting all products", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");

		if (featuredProducts) {
			return res.status(200).json(JSON.parse(featuredProducts));
		}

		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		return res.status(200).json(featuredProducts);
	}
	catch (error) {
		console.error("Error while getting featured products", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	try {
		const { category } = req.params;

		const products = await Product.find({ category });

		return res.status(200).json(products);
	}
	catch (error) {
		console.error("Error while getting products by category", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 }
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					price: 1,
					image: 1,
				}
			}
		]);

		return res.status(200).json(products);
	}
	catch (error) {
		console.error("Error while getting recommended products", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: FileFolders.PRODUCTS });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		return res.status(200).json(product);
	}
	catch (error) {
		console.error("Error while creating product", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.findById(productId);

		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();

			await updateFeaturedProductsCache();

			return res.status(200).json(updatedProduct);
		}

		return res.status(404).json({ message: "Product not found" });
	}
	catch (error) {
		console.error("Error while changing feature property of the product", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.id;

		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (deletedProduct.image) {
			const publicId = deletedProduct.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`${FileFolders.PRODUCTS}/${publicId}`);
			}
			catch (error) {
				console.error("Error while deleting product image from Cloudinary", error.message);
			}
		}

		return res.status(204).end();
	}
	catch (error) {
		console.error("Error while deleting product", error.message);
		return res.status(500).json({ message: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();

		await redis.set("featured_products", JSON.stringify(featuredProducts));
	}
	catch (error) {
		console.error("Error while updating featured products cache", error.message);
	}
}