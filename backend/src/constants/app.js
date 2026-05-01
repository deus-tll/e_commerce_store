export const CacheTypes = Object.freeze({
	REDIS: "redis",
	MEMORY: "memory"
});

export const PrefixCacheKeys = Object.freeze({
	AUTH: "AUTH",
	PRODUCTS: "PRODUCTS"
});

export const CacheKeys = Object.freeze({
	FEATURED_PRODUCTS: "featured_products",
	REFRESH_TOKEN: "refresh_token"
});

export const UserRoles = Object.freeze({
	CUSTOMER: "customer",
	ADMIN: "admin"
});

export const EnvModes = Object.freeze({
	PROD: "production",
	DEV: "development"
});