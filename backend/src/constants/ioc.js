export const RepositoryTypes = Object.freeze({
	CART: "ICartRepository",
	CATEGORY: "ICategoryRepository",
	COUPON: "ICouponRepository",
	ORDER: "IOrderRepository",
	PRODUCT: "IProductRepository",
	REVIEW: "IReviewRepository",
	USER: "IUserRepository"
});

export const UtilityTypes = Object.freeze({
	DATE: "IDateTimeService"
});

export const ProviderTypes = Object.freeze({
	JWT: "IJwtProvider",
	CACHE: "ICacheProvider"
});

export const CookieHandlerTypes = Object.freeze({
	AUTH: "IAuthCookieHandler"
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

export const ImageManagerTypes = Object.freeze({
	PRODUCT: "IProductImageManager",
	CATEGORY: "ICategoryImageManager"
});

export const QueryTranslatorTypes = Object.freeze({
	PRODUCT: "IProductQueryTranslator",
	USER: "IUserQueryTranslator"
});

export const ValidatorTypes = Object.freeze({
	COUPON: "ICouponValidator",
	REVIEW: "IReviewValidator"
});

export const FactoryTypes = Object.freeze({
	COUPON: "ICouponFactory"
});

export const ServiceTypes = Object.freeze({
	DATABASE: "IDatabaseService",

	AUTH_CACHE: "AuthCacheService",
	PRODUCT_CACHE: "ProductCacheService",
	EMAIL_CONTENT: "IEmailContentService",
	EMAIL: "IEmailService",
	PASSWORD: "IPasswordService",
	SLUG_GENERATOR: "ISlugGenerator",

	STORAGE: "IStorageService",

	CATEGORY_STORAGE: "ICategoryStorageService",
	PRODUCT_STORAGE: "IProductStorageService",

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
	PAYMENT: "IPaymentService",

	STRIPE: "IStripeService",
	CHECKOUT_ORDER_HANDLER: "ICheckoutOrderHandler",
	CHECKOUT_COUPON_HANDLER: "ICouponHandler"
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