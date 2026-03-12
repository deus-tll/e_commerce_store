export const OrderStatus = Object.freeze({
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	CANCELLED: "cancelled"
});

export const OrderStatusStyles = Object.freeze({
	[OrderStatus.PENDING]: "!text-yellow-500 !bg-yellow-500/10 !border-yellow-500/20",
	[OrderStatus.PROCESSING]: "!text-blue-500 !bg-blue-500/10 !border-blue-500/20",
	[OrderStatus.SHIPPED]: "!text-purple-500 !bg-purple-500/10 !border-purple-500/20",
	[OrderStatus.DELIVERED]: "!text-emerald-500 !bg-emerald-500/10 !border-emerald-500/20",
	[OrderStatus.CANCELLED]: "!text-rose-600 !bg-rose-600/10 !border-rose-600/20",
});

export const OrderStatusValues = Object.values(OrderStatus);