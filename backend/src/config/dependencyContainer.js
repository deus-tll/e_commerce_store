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
import {UserQueryBuilder} from "../services/user/UserQueryBuilder.js";
import {UserStatsService} from "../services/user/UserStatsService.js";
import {UserService} from "../services/user/UserService.js";
import {UserAccountService} from "../services/user/UserAccountService.js";
import {CategoryService} from "../services/category/CategoryService.js";
import {ProductMapper} from "../services/product/ProductMapper.js";
import {ProductCacheManager} from "../services/product/ProductCacheManager.js";
import {ProductQueryBuilder} from "../services/product/ProductQueryBuilder.js";
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
import {PaymentController} from "../controllers/PaymentController.js";
import {ProductController} from "../controllers/ProductController.js";
import {ReviewController} from "../controllers/ReviewController.js";
import {UserController} from "../controllers/UserController.js";

import {createAuthRouter} from "../http/routers/authRouterFactory.js";
import {createAnalyticsRouter} from "../http/routers/analyticsRouterFactory.js";
import {createCartRouter} from "../http/routers/cartRouterFactory.js";
import {createCategoriesRouter} from "../http/routers/categoriesRouterFactory.js";
import {createCouponsRouter} from "../http/routers/couponsRouterFactory.js";
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
	CacheManagerTypes,
	QueryBuilderTypes, ValidatorTypes, FactoryTypes
} from "../constants/ioc.js";

class Container {
	constructor() {
		this.services = new Map();
	}

	/**
	 * Registers a singleton service.
	 * @param {string} name - A unique name (token) for the service.
	 * @param {function} definition - A factory function that creates a service and its dependencies.
	 */
	register(name, definition) {
		this.services.set(name, { definition, instance: null });
	}

	/**
	 * Gets a registered service.
	 * @param {string} name
	 */
	get(name) {
		const service = this.services.get(name);

		if (!service) {
			throw new Error(`Service "${name}" is not registered.`);
		}

		if (!service.instance) {
			service.instance = service.definition(this);
		}

		return service.instance;
	}
}

const container = new Container();


// 1. Repositories (lowest level dependency, have no dependencies)
// ====================================================================
container.register(RepositoryTypes.CART, () => new CartMongooseRepository());
container.register(RepositoryTypes.CATEGORY, () => new CategoryMongooseRepository());
container.register(RepositoryTypes.COUPON, () => new CouponMongooseRepository());
container.register(RepositoryTypes.ORDER, () => new OrderMongooseRepository());
container.register(RepositoryTypes.PRODUCT, () => new ProductMongooseRepository());
container.register(RepositoryTypes.REVIEW, () => new ReviewMongooseRepository());
container.register(RepositoryTypes.USER, () => new UserMongooseRepository());
// ====================================================================


// 2. Independent Instances (lowest level dependency, have no dependencies)
// ====================================================================
// Services
container.register(ServiceTypes.AUTH_CACHE, () => new AuthCacheService());
container.register(ServiceTypes.PRODUCT_CACHE, () => new ProductCacheService());
container.register(ServiceTypes.EMAIL_CONTENT, () => new FilesystemEmailContentService());
container.register(ServiceTypes.PASSWORD, () => new PasswordService());
container.register(ServiceTypes.SLUG_GENERATOR, () => new SlugGenerator());
container.register(ServiceTypes.STORAGE, () => new CloudinaryStorageService());

// Providers
container.register(ProviderTypes.JWT, () => new JwtProvider());

// Factories
container.register(FactoryTypes.COUPON, () => new CouponFactory());

// Mappers
container.register(MapperTypes.CATEGORY, () => new CategoryMapper());
container.register(MapperTypes.COUPON, () => new CouponMapper());
container.register(MapperTypes.USER, () => new UserMapper());

// Utils
container.register(UtilityTypes.DATE, () => new DateTimeService());
// ====================================================================


// 3. Cookie Handlers
// ====================================================================
container.register(CookieHandlerTypes.AUTH, (c) => {
	const dateTimeService = c.get(UtilityTypes.DATE);
	return new AuthCookieHandler(dateTimeService);
});
// ====================================================================


// 4. Dependent Services (depends on repositories and independent services)
// ====================================================================
// Email
container.register(ServiceTypes.EMAIL, (c) => {
	const contentService = c.get(ServiceTypes.EMAIL_CONTENT);
	return new MailTrapEmailService(contentService);
});
// =============
// Storage
container.register(ServiceTypes.CATEGORY_STORAGE, (c) => {
	const storageService = c.get(ServiceTypes.STORAGE);
	return new CategoryStorageService(storageService);
});
container.register(ImageManagerTypes.CATEGORY, (c) => {
	const categoryStorageService = c.get(ServiceTypes.CATEGORY_STORAGE);
	return new CategoryImageManager(categoryStorageService);
});
container.register(ServiceTypes.PRODUCT_STORAGE, (c) => {
	const storageService = c.get(ServiceTypes.STORAGE);
	return new ProductStorageService(storageService);
});
container.register(ImageManagerTypes.PRODUCT, (c) => {
	const productStorageService = c.get(ServiceTypes.PRODUCT_STORAGE);
	return new ProductImageManager(productStorageService);
});
// =============
// User
container.register(ServiceTypes.USER_TOKEN, (c) => {
	const userRepository = c.get(RepositoryTypes.USER);
	const passwordService = c.get(ServiceTypes.PASSWORD);

	return new UserTokenService(userRepository, passwordService);
});
container.register(QueryBuilderTypes.USER, () => new UserQueryBuilder());
container.register(ServiceTypes.USER_STATS, (c) => {
	const userRepository = c.get(RepositoryTypes.USER);
	return new UserStatsService(userRepository);
});
container.register(ServiceTypes.USER, (c) => {
	const userRepository = c.get(RepositoryTypes.USER);
	const passwordService = c.get(ServiceTypes.PASSWORD);
	const userTokenService = c.get(ServiceTypes.USER_TOKEN);
	const userMapper = c.get(MapperTypes.USER);
	const userQueryBuilder = c.get(QueryBuilderTypes.USER);
	const userStatsService = c.get(ServiceTypes.USER_STATS);

	return new UserService(userRepository, passwordService, userTokenService, userMapper, userQueryBuilder, userStatsService);
});
container.register(ServiceTypes.USER_ACCOUNT, (c) => {
	const userService = c.get(ServiceTypes.USER);
	const emailService = c.get(ServiceTypes.EMAIL);
	const jwtProvider = c.get(ProviderTypes.JWT);
	const authCacheService = c.get(ServiceTypes.AUTH_CACHE);
	const userTokenService = c.get(ServiceTypes.USER_TOKEN);

	return new UserAccountService(userService, emailService, jwtProvider, authCacheService, userTokenService);
});
// =============
// Category
container.register(ServiceTypes.CATEGORY, (c) => {
	const categoryRepository = c.get(RepositoryTypes.CATEGORY);
	const categoryImageManager = c.get(ImageManagerTypes.CATEGORY);
	const categoryMapper = c.get(MapperTypes.CATEGORY);
	const slugGenerator = c.get(ServiceTypes.SLUG_GENERATOR);

	return new CategoryService(categoryRepository, categoryImageManager, categoryMapper, slugGenerator);
});
// =============
// Product
container.register(MapperTypes.PRODUCT, (c) => {
	const categoryService = c.get(ServiceTypes.CATEGORY);
	return new ProductMapper(categoryService);
});
container.register(CacheManagerTypes.PRODUCT, (c) => {
	const productCacheService = c.get(ServiceTypes.PRODUCT_CACHE);
	const productRepository = c.get(RepositoryTypes.PRODUCT);
	const productMapper = c.get(MapperTypes.PRODUCT);
	return new ProductCacheManager(productCacheService, productRepository, productMapper);
});
container.register(QueryBuilderTypes.PRODUCT, (c) => {
	const categoryService = c.get(ServiceTypes.CATEGORY);
	return new ProductQueryBuilder(categoryService);
});
container.register(ServiceTypes.PRODUCT, (c) => {
	const productRepository = c.get(RepositoryTypes.PRODUCT);
	const categoryService = c.get(ServiceTypes.CATEGORY);
	const productImageManager = c.get(ImageManagerTypes.PRODUCT);
	const productCacheManager = c.get(CacheManagerTypes.PRODUCT);
	const productQueryBuilder = c.get(QueryBuilderTypes.PRODUCT);
	const productMapper = c.get(MapperTypes.PRODUCT);

	return new ProductService(productRepository, categoryService, productImageManager, productCacheManager, productQueryBuilder, productMapper);
});
container.register(ServiceTypes.PRODUCT_STATS, (c) => {
	const productService = c.get(ServiceTypes.PRODUCT);
	return new ProductStatsService(productService);
});
// =============
// Cart
container.register(MapperTypes.CART, (c) => {
	const productService = c.get(ServiceTypes.PRODUCT);
	return new CartMapper(productService);
});
container.register(ServiceTypes.CART, (c) => {
	const cartRepository = c.get(RepositoryTypes.CART);
	const productService = c.get(ServiceTypes.PRODUCT);
	const cartMapper = c.get(MapperTypes.CART);

	return new CartService(cartRepository, productService, cartMapper);
});
// =============
// Review
container.register(ValidatorTypes.REVIEW, (c) => {
	const productService = c.get(ServiceTypes.PRODUCT);
	const userService = c.get(ServiceTypes.USER);

	return new ReviewValidator(productService, userService);
});
container.register(MapperTypes.REVIEW, (c) => {
	const userService = c.get(ServiceTypes.USER);
	const userMapper = c.get(MapperTypes.USER);

	return new ReviewMapper(userService, userMapper);
});
container.register(ServiceTypes.REVIEW, (c) => {
	const reviewRepository = c.get(RepositoryTypes.REVIEW);
	const reviewMapper = c.get(MapperTypes.REVIEW);
	const productStatsService = c.get(ServiceTypes.PRODUCT_STATS);
	const reviewValidator = c.get(ValidatorTypes.REVIEW);

	return new ReviewService(reviewRepository, reviewMapper, productStatsService, reviewValidator);
});
// =============
// Order
container.register(MapperTypes.ORDER, (c) => {
	const userService = c.get(ServiceTypes.USER);
	const userMapper = c.get(MapperTypes.USER);

	return new OrderMapper(userService, userMapper);
});
container.register(ServiceTypes.ORDER, (c) => {
	const orderRepository = c.get(RepositoryTypes.ORDER);
	const userService = c.get(ServiceTypes.USER);
	const orderMapper = c.get(MapperTypes.ORDER);

	return new OrderService(orderRepository, userService, orderMapper);
});
// =============
// Coupon
container.register(ValidatorTypes.COUPON, (c) => {
	const userRepository = c.get(RepositoryTypes.USER);
	const couponRepository = c.get(RepositoryTypes.COUPON);

	return new CouponValidator(userRepository, couponRepository);
});
container.register(ServiceTypes.COUPON, (c) => {
	const couponRepository = c.get(RepositoryTypes.COUPON);
	const couponValidator = c.get(ValidatorTypes.COUPON);
	const couponFactory = c.get(FactoryTypes.COUPON);
	const couponMapper = c.get(MapperTypes.COUPON);

	return new CouponService(couponRepository, couponValidator, couponFactory, couponMapper);
});
// =============
// Analytics
container.register(ServiceTypes.ANALYTICS, (c) => {
	const orderRepository = c.get(RepositoryTypes.ORDER);
	const userRepository = c.get(RepositoryTypes.USER);
	const productRepository = c.get(RepositoryTypes.PRODUCT);
	const dateTimeService = c.get(UtilityTypes.DATE);

	return new AnalyticsService(orderRepository, userRepository, productRepository, dateTimeService);
});
// =============
// Session Auth
container.register(ServiceTypes.SESSION_AUTH, (c) => {
	const userService = c.get(ServiceTypes.USER);
	const jwtProvider = c.get(ProviderTypes.JWT);
	const authCacheService = c.get(ServiceTypes.AUTH_CACHE);

	return new SessionAuthService(userService, jwtProvider, authCacheService);
});
// =============
// Payment
container.register(ServiceTypes.STRIPE, () => {
	return new StripeService();
});
container.register(ServiceTypes.CHECKOUT_ORDER_HANDLER, (c) => {
	const orderService = c.get(ServiceTypes.ORDER);
	const couponService = c.get(ServiceTypes.COUPON);

	return new CheckoutOrderHandler(orderService, couponService);
});
container.register(ServiceTypes.CHECKOUT_COUPON_HANDLER, (c) => {
	const couponService = c.get(ServiceTypes.COUPON);

	return new CheckoutCouponHandler(couponService);
});
container.register(ServiceTypes.PAYMENT, (c) => {
	const stripeService = c.get(ServiceTypes.STRIPE);
	const orderHandler = c.get(ServiceTypes.CHECKOUT_ORDER_HANDLER);
	const couponHandler = c.get(ServiceTypes.CHECKOUT_COUPON_HANDLER);

	return new StripePaymentService(stripeService, orderHandler, couponHandler);
});
// ====================================================================


// 5. Controllers (depends on services)
// ====================================================================
container.register(ControllerTypes.ANALYTICS, (c) => {
	const analyticsService = c.get(ServiceTypes.ANALYTICS);
	return new AnalyticsController(analyticsService);
});
container.register(ControllerTypes.AUTH, (c) => {
	const userAccountService = c.get(ServiceTypes.USER_ACCOUNT);
	const authCookieHandler = c.get(CookieHandlerTypes.AUTH);
	const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

	return new AuthController(sessionAuthService, userAccountService, authCookieHandler);
});
container.register(ControllerTypes.CART, (c) => {
	const cartService = c.get(ServiceTypes.CART);
	return new CartController(cartService);
});
container.register(ControllerTypes.CATEGORY, (c) => {
	const categoryService = c.get(ServiceTypes.CATEGORY);
	return new CategoryController(categoryService);
});
container.register(ControllerTypes.COUPON, (c) => {
	const couponService = c.get(ServiceTypes.COUPON);
	return new CouponController(couponService);
});
container.register(ControllerTypes.PAYMENT, (c) => {
	const paymentService = c.get(ServiceTypes.PAYMENT);
	const productService = c.get(ServiceTypes.PRODUCT);

	return new PaymentController(paymentService, productService);
});
container.register(ControllerTypes.PRODUCT, (c) => {
	const productService = c.get(ServiceTypes.PRODUCT);
	return new ProductController(productService);
});
container.register(ControllerTypes.REVIEW, (c) => {
	const reviewService = c.get(ServiceTypes.REVIEW);
	return new ReviewController(reviewService);
});
container.register(ControllerTypes.USER, (c) => {
	const userService = c.get(ServiceTypes.USER);
	return new UserController(userService);
});
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
container.register(SeederTypes.CATEGORY, (c) => {
	const categoryService = c.get(ServiceTypes.CATEGORY);
	return new CategorySeeder(categoryService);
});
container.register(SeederTypes.ADMIN, (c) => {
	const userService = c.get(ServiceTypes.USER);
	return new AdminSeeder(userService);
});
// ====================================================================

export default container;