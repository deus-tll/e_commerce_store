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

export const CookieManagerTypes = Object.freeze({
	AUTH: "AuthCookieManager"
});

export const ImageManagerTypes = Object.freeze({
	PRODUCT: "ProductImageManager",
	CATEGORY: "CategoryImageManager"
});

export const StorageServiceTypes = Object.freeze({
	CATEGORY: "CategoryStorageService",
	PRODUCT: "ProductStorageService"
});

export const ValidatorTypes = Object.freeze({
	COUPON: "CouponValidator",
	REVIEW: "ReviewValidator"
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
	PRODUCT_STATS: "ProductStatsService",

	CART: "CartService",

	USER: "UserService",
	USER_STATS: "UserStatsService",
	USER_TOKEN: "UserTokenService",
	USER_ACCOUNT: "UserAccountService",

	SESSION_AUTH: "SessionAuthService",

	REVIEW: "ReviewService",

	ANALYTICS: "AnalyticsService",

	ORDER: "OrderService",

	COUPON: "CouponService",

	CHECKOUT: "CheckoutService",
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