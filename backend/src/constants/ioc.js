import {ICheckoutService} from "../interfaces/order/ICheckoutService.js";

export const DatabaseRepositoryTypes = Object.freeze({
	CART: "ICartRepository",
	CATEGORY: "ICategoryRepository",
	COUPON: "ICouponRepository",
	ORDER: "IOrderRepository",
	PRODUCT: "IProductRepository",
	REVIEW: "IReviewRepository",
	USER: "IUserRepository"
});

export const CacheRepositoryTypes = Object.freeze({
	AUTH: "AuthCacheRepository",
	PRODUCT: "ProductCacheRepository",
});

export const ProviderTypes = Object.freeze({
	DATABASE: "IDatabaseProvider",
	CACHE: "ICacheProvider",
	STORAGE: "IStorageProvider",
	EMAIL: "IEmailProvider",
	PAYMENT: "IPaymentProvider",
});

export const MapperTypes = Object.freeze({
	CART: "CartMapper",
	REVIEW: "ReviewMapper",
	ORDER: "OrderMapper",
	COUPON: "CouponMapper",
	USER: "UserMapper"
});

export const CookieManagerTypes = Object.freeze({
	AUTH: "IAuthCookieManager"
});

export const ImageManagerTypes = Object.freeze({
	PRODUCT: "ProductImageManager",
	CATEGORY: "CategoryImageManager"
});

export const StorageServiceTypes = Object.freeze({
	CATEGORY: "CategoryStorageService",
	PRODUCT: "ProductStorageService"
});

export const ParserTypes = Object.freeze({
	USER_QUERY: "UserQueryParser"
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
	EMAIL_NOTIFICATION: "EmailNotificationService",

	CATEGORY: "CategoryService",
	PRODUCT: "ProductService",
});

export const ServiceTypes = Object.freeze({
	USER_TOKEN: "IUserTokenService",
	USER_STATS: "IUserStatsService",
	USER: "IUserService",
	USER_ACCOUNT: "IUserAccountService",

	PRODUCT_STATS: "ProductStatsService",

	CART: "ICartService",
	REVIEW: "IReviewService",
	ORDER: "IOrderService",
	COUPON: "ICouponService",

	ANALYTICS: "IAnalyticsService",
	SESSION_AUTH: "SessionAuthService",

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

export const SeederTypes = Object.freeze({
	ADMIN: "AdminSeeder",
	PRODUCTS_DUMMY_JSON: "ProductsDummyJson"
});