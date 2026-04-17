// ORDER
//=====================
export const OrderStatus = Object.freeze({
	AWAITING_PAYMENT: "awaiting_payment",
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	CANCELLED: "cancelled"
});

export const OrderStatusStyles = Object.freeze({
	[OrderStatus.AWAITING_PAYMENT]: "!text-slate-500 !bg-slate-500/10 !border-slate-500/20",
	[OrderStatus.PENDING]: "!text-yellow-500 !bg-yellow-500/10 !border-yellow-500/20",
	[OrderStatus.PROCESSING]: "!text-blue-500 !bg-blue-500/10 !border-blue-500/20",
	[OrderStatus.SHIPPED]: "!text-purple-500 !bg-purple-500/10 !border-purple-500/20",
	[OrderStatus.DELIVERED]: "!text-emerald-500 !bg-emerald-500/10 !border-emerald-500/20",
	[OrderStatus.CANCELLED]: "!text-rose-600 !bg-rose-600/10 !border-rose-600/20",
});

export const OrderStatusValues = Object.values(OrderStatus);

// USER
//=====================
export const UserRoles = Object.freeze({
	CUSTOMER: "customer",
	ADMIN: "admin"
});

export const UserRoleValues = Object.values(UserRoles);