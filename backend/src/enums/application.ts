export enum StorageFolder {
    CATEGORIES = "categories",
    PRODUCTS = "products",
}

export enum PrefixCacheKey {
    AUTH = "AUTH",
    PRODUCTS = "PRODUCTS"
}

export enum CacheKey {
    FEATURED_PRODUCTS = "featured_products",
    REFRESH_TOKEN = "refresh_token"
}

export enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin"
}

export const UserRoleValues = Object.values(UserRole);

export enum OrderStatus {
    AWAITING_PAYMENT = "awaiting_payment",
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

export const OrderStatusValues = Object.values(OrderStatus);