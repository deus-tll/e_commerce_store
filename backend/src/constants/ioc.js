import {ICheckoutService} from "../interfaces/order/ICheckoutService.js";

export const RepositoryTypes = Object.freeze({
	CART: "ICartRepository",
	CATEGORY: "ICategoryRepository",
	COUPON: "ICouponRepository",
	ORDER: "IOrderRepository",
	PRODUCT: "IProductRepository",
	REVIEW: "IReviewRepository",
	USER: "IUserRepository"
});

export const ProviderTypes = Object.freeze({
	DATABASE: "IDatabaseProvider",
	CACHE: "ICacheProvider",
	STORAGE: "IStorageProvider",
	EMAIL: "IEmailProvider",
	PAYMENT: "IPaymentProvider",
});

export const MapperTypes = Object.freeze({
	CATEGORY: "ICategoryMapper",
	PRODUCT: "IProductMapper",
	CART: "ICartMapper",
	REVIEW: "IReviewMapper",
	ORDER: "IOrderMapper",
	COUPON: "ICouponMapper",
	USER: "IUserMapper"
});

export const CookieManagerTypes = Object.freeze({
	AUTH: "IAuthCookieManager"
});

export const ImageManagerTypes = Object.freeze({
	PRODUCT: "IProductImageManager",
	CATEGORY: "ICategoryImageManager"
});

export const CacheManagerTypes = Object.freeze({
	AUTH: "IAuthCacheManager",
	PRODUCT: "IProductCacheManager"
});

export const StorageManagerTypes = Object.freeze({
	CATEGORY: "ICategoryStorageManager",
	PRODUCT: "IProductStorageManager"
});

export const ParserTypes = Object.freeze({
	PRODUCT_QUERY: "IProductQueryParser",
	USER_QUERY: "IUserQueryParser"
});

export const ValidatorTypes = Object.freeze({
	COUPON: "ICouponValidator",
	REVIEW: "IReviewValidator"
});

export const FactoryTypes = Object.freeze({
	COUPON: "ICouponFactory"
});

export const InfrastructureServiceTypes = Object.freeze({
	PASSWORD: "PasswordService",
	JWT: "JwtService",
	TEMPLATE: "TemplateService",
});

export const ApplicationServiceTypes = Object.freeze({
	EMAIL_NOTIFICATION: "EmailNotificationService"
});

export const ServiceTypes = Object.freeze({
	USER_TOKEN: "IUserTokenService",
	USER_STATS: "IUserStatsService",
	USER: "IUserService",
	USER_ACCOUNT: "IUserAccountService",
	CATEGORY: "ICategoryService",
	PRODUCT: "IProductService",

	PRODUCT_STATS: "IProductStatsService",

	CART: "ICartService",
	REVIEW: "IReviewService",
	ORDER: "IOrderService",
	COUPON: "ICouponService",

	ANALYTICS: "IAnalyticsService",
	SESSION_AUTH: "ISessionAuthService",

	CHECKOUT: "ICheckoutService",
});

export const ControllerTypes = Object.freeze({
	ANALYTICS: "AnalyticsController",
	AUTH: "AuthController",
	CART: "CartController",
	CATEGORY: "CategoryController",
	COUPON: "CouponController",
	ORDER: "OrderController",
	PAYMENT: "PaymentController",
	PRODUCT: "ProductController",
	REVIEW: "ReviewController",
	USER: "UserController"
});

export const RouterTypes = Object.freeze({
	AUTH: "authRouter",
	ANALYTICS: "analyticsRouter",
	CART: "cartRouter",
	CATEGORY: "categoriesRouter",
	COUPON: "couponsRouter",
	ORDER: "ordersRouter",
	PAYMENT: "paymentsRouter",
	PAYMENT_WEBHOOK: "paymentsWebhookRouter",
	PRODUCT: "productsRouter",
	REVIEW: "reviewsRouter",
	USER: "usersRouter",
});

export const SeederTypes = Object.freeze({
	ADMIN: "AdminSeeder",
	PRODUCTS_DUMMY_JSON: "ProductsDummyJson"
});