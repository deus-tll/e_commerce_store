import {ISeeder} from "./ISeeder.js";
import {CategoryService} from "../application/category/CategoryService.js";
import {ProductService} from "../application/product/ProductService.js";
import {UserService} from "../application/user/UserService.js";
import {ReviewService} from "../application/review/ReviewService.js";

import {ProductAttribute} from "../entities/product/types/ProductAttribute.js";
import {CategoryCreateInput} from "../application/types/category.js";
import {ProductCreateInput, ProductDTO} from "../application/types/product.js";
import {UserCreateInput} from "../application/types/user.js";
import {ReviewCreateInput} from "../application/types/review.js";

import {UserRole} from "../enums/application.js";

interface DummyJsonReview {
    rating: number;
    comment: string;
    reviewerName: string;
    reviewerEmail: string;
}

interface DummyJsonProduct {
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    thumbnail: string;
    images: string[];
    rating: number;
    brand?: string;
    dimensions: {
        width: string;
        height: string;
        depth: string;
    },
    weight: string;
    reviews: DummyJsonReview[]
}

const ALLOWED_ATTRIBUTES = {
    BRAND: "Brand",
    WEIGHT: "Weight",
    WIDTH: "Width",
    HEIGHT: "Height",
    DEPTH: "Depth",
};

export class ProductsDummyJsonSeeder implements ISeeder {
    private readonly categoryMap: Map<string, string> = new Map();
    private readonly userMap: Map<string, string> = new Map();

    constructor(
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly reviewService: ReviewService,
        private readonly productsUrlWithLimit: string,
        private readonly defaultSeederUserPassword: string,
        private readonly featuredProductsMinRating: number
    ) {}

    private async isDatabaseNotEmpty(): Promise<boolean> {
        const [categoryResult, productResult] = await Promise.all([
            this.categoryService.getAll(1, 1),
            this.productService.getAll(1, 1)
        ]);
        return categoryResult.pagination.total > 0 || productResult.pagination.total > 0;
    }

    private async fetchExternalProducts(): Promise<DummyJsonProduct[]> {
        const response = await fetch(this.productsUrlWithLimit);
        if (!response.ok) {
            console.error(`Failed to fetch products: ${response.statusText}`);
            return [];
        }
        const { products } = await response.json();

        return products || [];
    }

    private formatName(slug: string): string {
        if (!slug) return "Unknown";
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    private async getOrCreateCategory(slug: string, fallbackImage: string): Promise<string> {
        if (this.categoryMap.has(slug)) {
            return this.categoryMap.get(slug);
        }

        const categoryName = this.formatName(slug);
        const categoryCreateInput: CategoryCreateInput = {
            name: categoryName,
            image: fallbackImage,
            allowedAttributes: [
                ALLOWED_ATTRIBUTES.BRAND,
                ALLOWED_ATTRIBUTES.WEIGHT,
                ALLOWED_ATTRIBUTES.WIDTH,
                ALLOWED_ATTRIBUTES.HEIGHT,
                ALLOWED_ATTRIBUTES.DEPTH
            ]
        };

        const created = await this.categoryService.create(categoryCreateInput);
        this.categoryMap.set(slug, created.id);

        console.log(`[Seeder] Created category: ${created.name}`);

        return created.id;
    }

    private getMainImage(images: string[], thumbnail: string): string {
        return (images && images.length > 0)
            ? images[0]
            : thumbnail;
    }

    private getAdditionalImages(images: string[]): string[] {
        return (images && images.length > 1)
            ? images.slice(1)
            : [];
    }

    private async createProduct(p: DummyJsonProduct, categoryId: string): Promise<ProductDTO> {
        const possibleAttributePairs = [
            [ALLOWED_ATTRIBUTES.BRAND, p.brand],
            [ALLOWED_ATTRIBUTES.WEIGHT, p.weight],
            [ALLOWED_ATTRIBUTES.WIDTH, p.dimensions?.width],
            [ALLOWED_ATTRIBUTES.HEIGHT, p.dimensions?.height],
            [ALLOWED_ATTRIBUTES.DEPTH, p.dimensions?.depth]
        ] as const;

        const attributes: ProductAttribute[] = possibleAttributePairs
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([name, value]) => new ProductAttribute({ name, value }));

        const productCreateInput: ProductCreateInput = {
            name: p.title,
            description: p.description,
            price: p.price,
            stock: p.stock,
            categoryId,
            isFeatured: false,
            images: {
                mainImage: this.getMainImage(p.images, p.thumbnail),
                additionalImages: this.getAdditionalImages(p.images)
            },
            attributes
        };

        const created = await this.productService.create(productCreateInput);

        console.log(`[Seeder] Created product: ${created.name}`);

        return created;
    }

    private async getOrCreateUser(reviewData: DummyJsonReview): Promise<string> {
        const email = reviewData.reviewerEmail;
        if (this.userMap.has(email)) {
            return this.userMap.get(email);
        }

        const userCreateInput: UserCreateInput = {
            name: reviewData.reviewerName,
            email: email,
            password: this.defaultSeederUserPassword,
            role: UserRole.CUSTOMER,
            isVerified: true
        };

        const created = await this.userService.create(userCreateInput);
        this.userMap.set(email, created.id);
        return created.id;
    }

    private async processReviews(productId: string, reviews: DummyJsonReview[]): Promise<void> {
        const processedUsersForThisProduct: Set<string> = new Set();

        for (const reviewData of reviews) {
            const userId = await this.getOrCreateUser(reviewData);

            if (processedUsersForThisProduct.has(userId)) {
                console.warn(`[Seeder] Skipping duplicate review from user ${userId} for product ${productId}`);
                continue;
            }

            const reviewCreateInput: ReviewCreateInput = {
                rating: reviewData.rating,
                comment: reviewData.comment
            };

            try {
                await this.reviewService.create(productId, userId, reviewCreateInput);
                processedUsersForThisProduct.add(userId);
            } catch (error) {
                console.error(`[Seeder] Could not create review: ${error.message}`);
            }
        }
    }

    async seed(): Promise<void> {
        try {
            console.log("[Seeder] Starting DummyJson seeding process...");

            if (await this.isDatabaseNotEmpty()) {
                console.log("[Seeder] Database is not empty. Skipping seeding.");
                return;
            }

            const products = await this.fetchExternalProducts();
            if (!products.length) return;

            for (const p of products) {
                const categoryId = await this.getOrCreateCategory(p.category, this.getMainImage(p.images, p.thumbnail));
                const createdProduct = await this.createProduct(p, categoryId);

                if (p.reviews && Array.isArray(p.reviews) && p.reviews.length > 0) {
                    await this.processReviews(createdProduct.id, p.reviews);
                }
            }

            await this.productService.updateFeaturedByRating(this.featuredProductsMinRating);
            console.log("[Seeder] Featured products updated based on rating.");

            console.log("[Seeder] DummyJson seeding completed successfully!");
        }
        catch(error) {
            console.error("[Seeder] Error during seeding:", error.message);
        }
    }
}