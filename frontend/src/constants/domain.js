// ORDER
//=====================
const ORDER_STATUS = Object.freeze({
	AWAITING_PAYMENT: "awaiting_payment",
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	CANCELLED: "cancelled"
});

export const ORDER_STATUS_STYLES = Object.freeze({
	[ORDER_STATUS.AWAITING_PAYMENT]: "!text-slate-500 !bg-slate-500/10 !border-slate-500/20",
	[ORDER_STATUS.PENDING]: "!text-yellow-500 !bg-yellow-500/10 !border-yellow-500/20",
	[ORDER_STATUS.PROCESSING]: "!text-blue-500 !bg-blue-500/10 !border-blue-500/20",
	[ORDER_STATUS.SHIPPED]: "!text-purple-500 !bg-purple-500/10 !border-purple-500/20",
	[ORDER_STATUS.DELIVERED]: "!text-emerald-500 !bg-emerald-500/10 !border-emerald-500/20",
	[ORDER_STATUS.CANCELLED]: "!text-rose-600 !bg-rose-600/10 !border-rose-600/20",
});

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

// USER
//=====================
export const USER_ROLES = Object.freeze({
	CUSTOMER: "customer",
	ADMIN: "admin"
});

export const USER_ROLE_VALUES = Object.values(USER_ROLES);