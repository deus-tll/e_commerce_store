import {CategoryService} from "../application/category/CategoryService.js";
import {IProductService} from "../interfaces/product/IProductService.js";
import {IUserService} from "../interfaces/user/IUserService.js";
import {IReviewService} from "../interfaces/review/IReviewService.js";

import {
    CreateProductDTO,
    ProductAttribute,
    CreateUserDTO,
    CreateReviewDTO
} from "../domain/index.js";
import {CreateCategoryDTO} from "../application/dtos/category.dto.ts";


import {BaseSeeder} from "./BaseSeeder.js";

import {UserRoles} from "../constants/app.js";

/**
 * @typedef {Object} DummyJsonProduct
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {string} category
 * @property {string} thumbnail
 * @property {string[]} images
 * @property {number} rating
 * @property {string} [brand]
 * @property {Object} dimensions
 * @property {number} dimensions.width
 * @property {number} dimensions.height
 * @property {number} dimensions.depth
 * @property {number} weight
 * @property {DummyJsonReview[]} reviews
 */

/**
 * @typedef {Object} DummyJsonReview
 * @property {number} rating
 * @property {string} comment
 * @property {string} reviewerName
 * @property {string} reviewerEmail
 */

const ALLOWED_ATTRIBUTES = {
    BRAND: "Brand",
    WEIGHT: "Weight",
    WIDTH: "Width",
    HEIGHT: "Height",
    DEPTH: "Depth",
};

export class ProductsDummyJsonSeeder extends BaseSeeder {
    /** @type {CategoryService} */ #categoryService;
    /** @type {IProductService} */ #productService;
    /** @type {IUserService} */ #userService;
    /** @type {IReviewService} */ #reviewService;
    /** @type {string} */ #productsUrlWithLimit;
    /** @type {string} */ #defaultSeederUserPassword;
    /** @type {number} */ #featuredProductsMinRating;

    #categoryMap = new Map();
    #userMap = new Map();

    /**
     * @param {CategoryService} categoryService
     * @param {IProductService} productService
     * @param {IUserService} userService
     * @param {IReviewService} reviewService
     * @param {string} productsUrlWithLimit
     * @param {string} defaultSeederUserPassword
     * @param {number} featuredProductsMinRating
     */
    constructor(
        categoryService,
        productService,
        userService,
        reviewService,
        productsUrlWithLimit,
        defaultSeederUserPassword,
        featuredProductsMinRating
    )
    {
        super();
        this.#categoryService = categoryService;
        this.#productService = productService;
        this.#userService = userService;
        this.#reviewService = reviewService;
        this.#productsUrlWithLimit = productsUrlWithLimit;
        this.#defaultSeederUserPassword = defaultSeederUserPassword;
        this.#featuredProductsMinRating = featuredProductsMinRating;
    }

    async #isDatabaseNotEmpty() {
        const [categoryResult, productResult] = await Promise.all([
            this.#categoryService.getAll(1, 1),
            this.#productService.getAll(1, 1)
        ]);
        return categoryResult.pagination.total > 0 || productResult.pagination.total > 0;
    }

    async #fetchExternalProducts() {
        const response = await fetch(this.#productsUrlWithLimit);
        if (!response.ok) {
            console.error(`Failed to fetch products: ${response.statusText}`);
            return [];
        }
        const { products } = await response.json();
        return products || [];
    }

    /**
     * @param {string} slug
     * @param {string} fallbackImage
     * @returns {Promise<string>} categoryId
     */
    async #getOrCreateCategory(slug, fallbackImage) {
        if (this.#categoryMap.has(slug)) {
            return this.#categoryMap.get(slug);
        }

        const categoryName = this.#formatName(slug);
        const dto = new CreateCategoryDTO({
            name: categoryName,
            image: fallbackImage,
            allowedAttributes: [
                ALLOWED_ATTRIBUTES.BRAND,
                ALLOWED_ATTRIBUTES.WEIGHT,
                ALLOWED_ATTRIBUTES.WIDTH,
                ALLOWED_ATTRIBUTES.HEIGHT,
                ALLOWED_ATTRIBUTES.DEPTH
            ],
        });

        const created = await this.#categoryService.create(dto);
        this.#categoryMap.set(slug, created.id);
        console.log(`[Seeder] Created category: ${created.name}`);
        return created.id;
    }

    #getMainImage(images, thumbnail) {
        return (images && images.length > 0)
            ? images[0]
            : thumbnail;
    }

    #getAdditionalImages(images) {
        return (images && images.length > 1)
            ? images.slice(1)
            : [];
    }

    /**
     * @param {DummyJsonProduct} p
     * @param {string} categoryId
     */
    async #createProduct(p, categoryId) {
        let attributes = [];

        const ifPresentThenPush = (name, value) => {
            if (value) {
                attributes.push(new ProductAttribute({ name, value }));
            }
        }

        ifPresentThenPush(ALLOWED_ATTRIBUTES.BRAND, p.brand);
        ifPresentThenPush(ALLOWED_ATTRIBUTES.WEIGHT, p.weight);
        ifPresentThenPush(ALLOWED_ATTRIBUTES.WIDTH, p.dimensions?.width);
        ifPresentThenPush(ALLOWED_ATTRIBUTES.HEIGHT, p.dimensions?.height);
        ifPresentThenPush(ALLOWED_ATTRIBUTES.DEPTH, p.dimensions?.depth);

        const dto = new CreateProductDTO({
            name: p.title,
            description: p.description,
            price: p.price,
            stock: p.stock,
            categoryId,
            isFeatured: false,
            images: {
                mainImage: this.#getMainImage(p.images, p.thumbnail),
                additionalImages: this.#getAdditionalImages(p.images)
            },
            attributes
        });

        const created = await this.#productService.create(dto);
        console.log(`[Seeder] Created product: ${created.name}`);
        return created;
    }

    /**
     * @param {DummyJsonReview} reviewData
     * @returns {Promise<string>} userId
     */
    async #getOrCreateUser(reviewData) {
        const email = reviewData.reviewerEmail;
        if (this.#userMap.has(email)) {
            return this.#userMap.get(email);
        }

        const dto = new CreateUserDTO({
            name: reviewData.reviewerName,
            email: email,
            password: this.#defaultSeederUserPassword,
            role: UserRoles.CUSTOMER,
            isVerified: true
        });

        const created = await this.#userService.create(dto);
        this.#userMap.set(email, created.id);
        return created.id;
    }

    /**
     * @param {string} productId
     * @param {DummyJsonReview[]} reviews
     */
    async #processReviews(productId, reviews) {
        const processedUsersForThisProduct = new Set();

        for (const reviewData of reviews) {
            const userId = await this.#getOrCreateUser(reviewData);

            if (processedUsersForThisProduct.has(userId)) {
                console.warn(`[Seeder] Skipping duplicate review from user ${userId} for product ${productId}`);
                continue;
            }

            const dto = new CreateReviewDTO({
                rating: reviewData.rating,
                comment: reviewData.comment
            });

            try {
                await this.#reviewService.create(productId, userId, dto);
                processedUsersForThisProduct.add(userId);
            } catch (error) {
                console.error(`[Seeder] Could not create review: ${error.message}`);
            }
        }
    }

    #formatName(slug) {
        if (!slug) return "Unknown";
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async seed() {
        try {
            console.log("[Seeder] Starting DummyJson seeding process...");

            if (await this.#isDatabaseNotEmpty()) {
                console.log("[Seeder] Database is not empty. Skipping seeding.");
                return;
            }

            const products = await this.#fetchExternalProducts();
            if (!products.length) return;

            for (const p of products) {
                const categoryId = await this.#getOrCreateCategory(p.category, this.#getMainImage(p.images, p.thumbnail));
                const createdProduct = await this.#createProduct(p, categoryId);

                if (p.reviews && Array.isArray(p.reviews) && p.reviews.length > 0) {
                    await this.#processReviews(createdProduct.id, p.reviews);
                }
            }

            await this.#productService.updateFeaturedByRating(this.#featuredProductsMinRating);
            console.log("[Seeder] Featured products updated based on rating.");

            console.log("[Seeder] DummyJson seeding completed successfully!");
        }
        catch(error) {
            console.error("[Seeder] Error during seeding:", error.message);
        }
    }
}