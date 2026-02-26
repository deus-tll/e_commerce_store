import {CartMongooseRepository} from "../repositories/mongoose/CartMongooseRepository.js";
import {CategoryMongooseRepository} from "../repositories/mongoose/CategoryMongooseRepository.js";
import {CouponMongooseRepository} from "../repositories/mongoose/CouponMongooseRepository.js";
import {OrderMongooseRepository} from "../repositories/mongoose/OrderMongooseRepository.js";
import {ProductMongooseRepository} from "../repositories/mongoose/ProductMongooseRepository.js";
import {ReviewMongooseRepository} from "../repositories/mongoose/ReviewMongooseRepository.js";
import {UserMongooseRepository} from "../repositories/mongoose/UserMongooseRepository.js";

import {JwtProvider} from "../providers/JwtProvider.js";

import {AuthCookieHandler} from "../http/cookies/AuthCookieHandler.js";

import {AuthCacheService} from "../cache/AuthCacheService.js";
import {ProductCacheService} from "../cache/ProductCacheService.js";
import {FilesystemEmailContentService} from "../services/email/FilesystemEmailContentService.js";
import {MailTrapEmailService} from "../services/email/MailTrapEmailService.js";
import {PasswordService} from "../services/security/PasswordService.js";
import {SlugGenerator} from "../services/utils/SlugGenerator.js";
import {DateTimeService} from "../services/utils/DateTimeService.js";

import {CategoryMapper} from "../services/category/CategoryMapper.js";
import {CouponMapper} from "../services/coupon/CouponMapper.js";
import {CouponFactory} from "../services/coupon/CouponFactory.js";
import {UserMapper} from "../services/user/UserMapper.js";

import {CloudinaryStorageService} from "../services/storages/CloudinaryStorageService.js";
import {CategoryStorageService} from "../services/storages/CategoryStorageService.js";
import {CategoryImageManager} from "../services/category/CategoryImageManager.js";
import {ProductStorageService} from "../services/storages/ProductStorageService.js";
import {ProductImageManager} from "../services/product/ProductImageManager.js";

import {UserTokenService} from "../services/user/UserTokenService.js";
import {UserQueryTranslator} from "../services/user/UserQueryTranslator.js";
import {UserStatsService} from "../services/user/UserStatsService.js";
import {UserService} from "../services/user/UserService.js";
import {UserAccountService} from "../services/user/UserAccountService.js";
import {CategoryService} from "../services/category/CategoryService.js";
import {ProductMapper} from "../services/product/ProductMapper.js";
import {ProductQueryTranslator} from "../services/product/ProductQueryTranslator.js";
import {ProductService} from "../services/product/ProductService.js";
import {ProductStatsService} from "../services/product/ProductStatsService.js";
import {CartMapper} from "../services/cart/CartMapper.js";
import {CartService} from "../services/cart/CartService.js";
import {ReviewValidator} from "../services/review/ReviewValidator.js";
import {ReviewMapper} from "../services/review/ReviewMapper.js";
import {ReviewService} from "../services/review/ReviewService.js";
import {OrderMapper} from "../services/order/OrderMapper.js";
import {OrderService} from "../services/order/OrderService.js";
import {CouponValidator} from "../services/coupon/CouponValidator.js";
import {CouponService} from "../services/coupon/CouponService.js";
import {AnalyticsService} from "../services/analytics/AnalyticsService.js";
import {SessionAuthService} from "../services/auth/SessionAuthService.js";

import {StripeService} from "../services/payment/StripeService.js";
import {CheckoutOrderHandler} from "../services/order/CheckoutOrderHandler.js";
import {CheckoutCouponHandler} from "../services/coupon/CheckoutCouponHandler.js";
import {StripePaymentService} from "../services/payment/StripePaymentService.js";

import {AnalyticsController} from "../controllers/AnalyticsController.js";
import {AuthController} from "../controllers/AuthController.js";
import {CartController} from "../controllers/CartController.js";
import {CategoryController} from "../controllers/CategoryController.js";
import {CouponController} from "../controllers/CouponController.js";
import {OrderController} from "../controllers/OrderController.js";
import {PaymentController} from "../controllers/PaymentController.js";
import {ProductController} from "../controllers/ProductController.js";
import {ReviewController} from "../controllers/ReviewController.js";
import {UserController} from "../controllers/UserController.js";

import {createAuthRouter} from "../http/routers/authRouterFactory.js";
import {createAnalyticsRouter} from "../http/routers/analyticsRouterFactory.js";
import {createCartRouter} from "../http/routers/cartRouterFactory.js";
import {createCategoriesRouter} from "../http/routers/categoriesRouterFactory.js";
import {createCouponsRouter} from "../http/routers/couponsRouterFactory.js";
import {createOrdersRouter} from "../http/routers/ordersRouterFactory.js";
import {createPaymentsRouter} from "../http/routers/paymentsRouterFactory.js";
import {createProductsRouter} from "../http/routers/productsRouterFactory.js";
import {createReviewsRouter} from "../http/routers/reviewsRouterFactory.js";
import {createUsersRouter} from "../http/routers/usersRouterFactory.js";

import {AdminSeeder} from "../seeders/AdminSeeder.js";
import {CategorySeeder} from "../seeders/CategorySeeder.js";

import {
	RepositoryTypes,
	ProviderTypes,
	CookieHandlerTypes,
	ControllerTypes,
	MapperTypes,
	ServiceTypes,
	RouterTypes,
	SeederTypes,
	UtilityTypes,
	ImageManagerTypes,
	QueryTranslatorTypes, ValidatorTypes, FactoryTypes
} from "../constants/ioc.js";

import {config} from "../config.js";

class Container {
	constructor() {
		this.services = new Map();
		this.resolving = new Set();
	}

	/**
	 * Registers a service.
	 * @param {string} name - Unique token.
	 * @param {function|Class} definition - Factory function OR Class constructor.
	 * @param {string[]} [dependencies=null] - Optional array of tokens to inject.
	 */
	register(name, definition, dependencies = null) {
		if (dependencies && typeof definition === 'function' && definition.prototype) {
			const expected = definition.length;
			const actual = dependencies.length;

			if (actual !== expected) {
				throw new Error(
					`[DI Error]: "${name}" registration mismatch. ` +
					`Class expects ${expected} arguments, but ${actual} were provided.`
				);
			}
		}

		this.services.set(name, { definition, dependencies, instance: null });
	}

	/**
	 * Gets a registered service.
	 * @param {string} name
	 */
	get(name) {
		const service = this.services.get(name);

		if (!service) {
			throw new Error(`[DI Error]: Service "${name}" is not registered in the container.`);
		}

		if (service.instance) return service.instance;

		if (this.resolving.has(name)) {
			const chain = [...this.resolving, name].join(" -> ");
			throw new Error(`[DI Error]: Circular dependency detected: ${chain}`);
		}

		this.resolving.add(name);

		try {
			const { definition, dependencies } = service;

			if (dependencies) {
				const resolvedDeps = dependencies.map(dep => this.get(dep));
				service.instance = new definition(...resolvedDeps);
			}
			else {
				service.instance = definition(this);
			}

			return service.instance;
		}
		finally {
			this.resolving.delete(name);
		}
	}

	/**
	 * Ensures all registered services can be resolved without errors.
	 */
	verify() {
		console.log("[IoC Container] Verifying...");
		for (const name of this.services.keys()) {
			this.get(name);
		}
		console.log("[IoC Container] Verified successfully.");
	}
}

const container = new Container();


// 1. Repositories (lowest level dependency, have no dependencies)
// ====================================================================
container.register(RepositoryTypes.CART, CartMongooseRepository, []);
container.register(RepositoryTypes.CATEGORY, CategoryMongooseRepository, []);
container.register(RepositoryTypes.COUPON, CouponMongooseRepository, []);
container.register(RepositoryTypes.ORDER, OrderMongooseRepository, []);
container.register(RepositoryTypes.PRODUCT, ProductMongooseRepository, []);
container.register(RepositoryTypes.REVIEW, ReviewMongooseRepository, []);
container.register(RepositoryTypes.USER, UserMongooseRepository, []);
// ====================================================================


// 2. Independent Instances (lowest level dependency, have no dependencies)
// ====================================================================
// Services
container.register(ServiceTypes.AUTH_CACHE, AuthCacheService, []);
container.register(ServiceTypes.PRODUCT_CACHE, ProductCacheService, []);
container.register(ServiceTypes.EMAIL_CONTENT, FilesystemEmailContentService, []);
container.register(ServiceTypes.PASSWORD, PasswordService, []);
container.register(ServiceTypes.SLUG_GENERATOR, SlugGenerator, []);
container.register(ServiceTypes.STORAGE, CloudinaryStorageService, []);

// Providers
container.register(ProviderTypes.JWT, JwtProvider, []);

// Factories
container.register(FactoryTypes.COUPON, () => new CouponFactory(config.business.coupon.discountPercentage));

// Mappers
container.register(MapperTypes.CART, CartMapper, []);
container.register(MapperTypes.CATEGORY, CategoryMapper, []);
container.register(MapperTypes.COUPON, CouponMapper, []);
container.register(MapperTypes.ORDER, OrderMapper, []);
container.register(MapperTypes.PRODUCT, ProductMapper, []);
container.register(MapperTypes.REVIEW, ReviewMapper, []);
container.register(MapperTypes.USER, UserMapper, []);

// Translators
container.register(QueryTranslatorTypes.PRODUCT, ProductQueryTranslator, []);
container.register(QueryTranslatorTypes.USER, UserQueryTranslator, []);

// Utils
container.register(UtilityTypes.DATE, DateTimeService, []);
// ====================================================================


// 3. Cookie Handlers
// ====================================================================
container.register(CookieHandlerTypes.AUTH, AuthCookieHandler, [UtilityTypes.DATE]);
// ====================================================================


// 4. Dependent Services (depends on repositories and independent services)
// ====================================================================
// Email
container.register(ServiceTypes.EMAIL, MailTrapEmailService, [ServiceTypes.EMAIL_CONTENT]);
// =============
// Storage
container.register(ServiceTypes.CATEGORY_STORAGE, CategoryStorageService, [ServiceTypes.STORAGE]);
container.register(ImageManagerTypes.CATEGORY, CategoryImageManager, [ServiceTypes.CATEGORY_STORAGE]);
container.register(ServiceTypes.PRODUCT_STORAGE, ProductStorageService, [ServiceTypes.STORAGE]);
container.register(ImageManagerTypes.PRODUCT, ProductImageManager, [ServiceTypes.PRODUCT_STORAGE]);
// =============
// User
container.register(ServiceTypes.USER_TOKEN, UserTokenService, [RepositoryTypes.USER, ServiceTypes.PASSWORD]);
container.register(ServiceTypes.USER_STATS, UserStatsService, [RepositoryTypes.USER]);
container.register(ServiceTypes.USER, UserService,
	[RepositoryTypes.USER, ServiceTypes.PASSWORD, ServiceTypes.USER_TOKEN, MapperTypes.USER, QueryTranslatorTypes.USER]
);
container.register(ServiceTypes.USER_ACCOUNT, UserAccountService,
	[ServiceTypes.USER, ServiceTypes.EMAIL, ServiceTypes.PASSWORD, ProviderTypes.JWT, ServiceTypes.AUTH_CACHE, ServiceTypes.USER_TOKEN, MapperTypes.USER]
);
// =============
// Category
container.register(ServiceTypes.CATEGORY, CategoryService,
	[RepositoryTypes.CATEGORY, ImageManagerTypes.CATEGORY, MapperTypes.CATEGORY, ServiceTypes.SLUG_GENERATOR]
);
// =============
// Product
container.register(ServiceTypes.PRODUCT, ProductService,
	[RepositoryTypes.PRODUCT, ServiceTypes.CATEGORY, ServiceTypes.PRODUCT_CACHE, ImageManagerTypes.PRODUCT, QueryTranslatorTypes.PRODUCT, MapperTypes.PRODUCT]
);
container.register(ServiceTypes.PRODUCT_STATS, ProductStatsService, [ServiceTypes.PRODUCT]);
// =============
// Cart
container.register(ServiceTypes.CART, CartService,
	[RepositoryTypes.CART, ServiceTypes.PRODUCT, MapperTypes.CART]
);
// =============
// Review
container.register(ValidatorTypes.REVIEW, ReviewValidator, [ServiceTypes.PRODUCT, ServiceTypes.USER]);
container.register(ServiceTypes.REVIEW, ReviewService,
	[RepositoryTypes.REVIEW, ServiceTypes.USER, ServiceTypes.PRODUCT_STATS, ValidatorTypes.REVIEW, MapperTypes.REVIEW]
);
// =============
// Order
container.register(ServiceTypes.ORDER, OrderService, [RepositoryTypes.ORDER, ServiceTypes.USER, MapperTypes.ORDER]);
// =============
// Coupon
container.register(ValidatorTypes.COUPON, CouponValidator, [ServiceTypes.USER, RepositoryTypes.COUPON]);
container.register(ServiceTypes.COUPON, CouponService,
	[RepositoryTypes.COUPON, ValidatorTypes.COUPON, FactoryTypes.COUPON, MapperTypes.COUPON]
);
// =============
// Analytics
container.register(ServiceTypes.ANALYTICS, AnalyticsService,
	[RepositoryTypes.ORDER, RepositoryTypes.USER, RepositoryTypes.PRODUCT, UtilityTypes.DATE]
);
// =============
// Session Auth
container.register(ServiceTypes.SESSION_AUTH, SessionAuthService,
	[ServiceTypes.USER, ServiceTypes.PASSWORD, ProviderTypes.JWT, ServiceTypes.AUTH_CACHE]
);
// =============
// Payment
container.register(ServiceTypes.STRIPE, StripeService, []);
container.register(ServiceTypes.CHECKOUT_COUPON_HANDLER, CheckoutCouponHandler, [ServiceTypes.COUPON]);
container.register(ServiceTypes.CHECKOUT_ORDER_HANDLER, CheckoutOrderHandler,
	[ServiceTypes.ORDER, ServiceTypes.COUPON, ServiceTypes.CART, ServiceTypes.CHECKOUT_COUPON_HANDLER]
);
container.register(ServiceTypes.PAYMENT, StripePaymentService,
	[ServiceTypes.STRIPE, ServiceTypes.PRODUCT, ServiceTypes.CHECKOUT_ORDER_HANDLER, ServiceTypes.CHECKOUT_COUPON_HANDLER]
);
// ====================================================================


// 5. Controllers (depends on services)
// ====================================================================
container.register(ControllerTypes.ANALYTICS, AnalyticsController, [ServiceTypes.ANALYTICS]);
container.register(ControllerTypes.AUTH, AuthController, [ServiceTypes.SESSION_AUTH, ServiceTypes.USER_ACCOUNT, CookieHandlerTypes.AUTH]);
container.register(ControllerTypes.CART, CartController, [ServiceTypes.CART]);
container.register(ControllerTypes.CATEGORY, CategoryController, [ServiceTypes.CATEGORY]);
container.register(ControllerTypes.COUPON, CouponController, [ServiceTypes.COUPON]);
container.register(ControllerTypes.ORDER, OrderController, [ServiceTypes.ORDER]);
container.register(ControllerTypes.PAYMENT, PaymentController, [ServiceTypes.PAYMENT]);
container.register(ControllerTypes.PRODUCT, ProductController, [ServiceTypes.PRODUCT]);
container.register(ControllerTypes.REVIEW, ReviewController, [ServiceTypes.REVIEW]);
container.register(ControllerTypes.USER, UserController, [ServiceTypes.USER, ServiceTypes.USER_STATS]);
// ====================================================================


// 6. Routers (Depends on Controller and Middleware/Service)
// ====================================================================
container.register(RouterTypes.AUTH, (c) => {
	const authController = c.get(ControllerTypes.AUTH);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createAuthRouter(authController, sessionAuthService);
});
container.register(RouterTypes.ANALYTICS, (c) => {
	const analyticsController = c.get(ControllerTypes.ANALYTICS);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createAnalyticsRouter(analyticsController, sessionAuthService);
});
container.register(RouterTypes.CART, (c) => {
	const cartController = c.get(ControllerTypes.CART);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createCartRouter(cartController, sessionAuthService);
});
container.register(RouterTypes.CATEGORY, (c) => {
	const categoryController = c.get(ControllerTypes.CATEGORY);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createCategoriesRouter(categoryController, sessionAuthService);
});
container.register(RouterTypes.COUPON, (c) => {
	const couponController = c.get(ControllerTypes.COUPON);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createCouponsRouter(couponController, sessionAuthService);
});
container.register(RouterTypes.ORDER, (c) => {
	const orderController = c.get(ControllerTypes.ORDER);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createOrdersRouter(orderController, sessionAuthService);
});
container.register(RouterTypes.PAYMENT, (c) => {
	const paymentController = c.get(ControllerTypes.PAYMENT);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createPaymentsRouter(paymentController, sessionAuthService);
});
container.register(RouterTypes.PRODUCT, (c) => {
	const productController = c.get(ControllerTypes.PRODUCT);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createProductsRouter(productController, sessionAuthService);
});
container.register(RouterTypes.REVIEW, (c) => {
	const reviewController = c.get(ControllerTypes.REVIEW);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createReviewsRouter(reviewController, sessionAuthService);
});
container.register(RouterTypes.USER, (c) => {
	const userController = c.get(ControllerTypes.USER);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return createUsersRouter(userController, sessionAuthService);
});
// ====================================================================


// 7. Seeders (depends on services)
// ====================================================================
container.register(SeederTypes.CATEGORY, CategorySeeder, [ServiceTypes.CATEGORY]);
container.register(SeederTypes.ADMIN, AdminSeeder, [ServiceTypes.USER]);
// ====================================================================

export default container;