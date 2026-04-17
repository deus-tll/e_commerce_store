export const OrderStatus = Object.freeze({
	AWAITING_PAYMENT: "awaiting_payment",
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	CANCELLED: "cancelled"
});

export const OrderStatusValues = Object.values(OrderStatus);