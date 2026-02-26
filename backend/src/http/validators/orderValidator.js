import Joi from "joi";
import { OrderStatus } from "../../constants/domain.js";
import { emptyParamAndBody } from "./common.joi.js";

const orderIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Order ID is required.',
		'string.empty': 'Order ID cannot be empty.'
	});

/**
 * Joi schema for validating the GET /orders (Admin)
 */
export const getAllOrdersSchema = Joi.object({
	...emptyParamAndBody,
	query: Joi.object({
		page: Joi.number().integer().min(1).default(1).optional(),
		limit: Joi.number().integer().min(1).max(100).default(10).optional(),
		status: Joi.string().valid(...Object.values(OrderStatus)).optional(),
		userId: Joi.string().trim().optional(),
		sortBy: Joi.string().valid('createdAt', 'totalAmount').default('createdAt').optional(),
		order: Joi.string().valid('asc', 'desc').default('desc').optional()
	}).unknown(false)
});

/**
 * Joi schema for validating the GET /orders/mine (Customer)
 */
export const getMineOrdersSchema = Joi.object({
	...emptyParamAndBody,
	query: Joi.object({
		page: Joi.number().integer().min(1).default(1).optional(),
		limit: Joi.number().integer().min(1).max(50).default(10).optional(),
		status: Joi.string().valid(...Object.values(OrderStatus)).optional(),
		sortBy: Joi.string().valid('createdAt', 'totalAmount').default('createdAt').optional(),
		order: Joi.string().valid('asc', 'desc').default('desc').optional()
	}).unknown(false)
});

/**
 * Joi schema for validating order status updates (Admin)
 */
export const updateOrderStatusSchema = Joi.object({
	params: Joi.object({
		id: orderIdParam
	}).required(),
	body: Joi.object({
		status: Joi.string().valid(...Object.values(OrderStatus)).required().messages({
			'any.only': 'Invalid order status.',
			'any.required': 'Status is required.'
		})
	}).required().unknown(false),
	query: Joi.object({}).optional()
});

/**
 * Joi schema for simple ID parameter validation
 */
export const orderIdSchema = Joi.object({
	params: Joi.object({
		id: orderIdParam
	}).required(),
	body: Joi.object({}).optional(),
	query: Joi.object({}).optional()
});

/**
 * Joi schema for searching by order number (Admin)
 */
export const orderNumberSchema = Joi.object({
	params: Joi.object({
		orderNumber: Joi.string().trim().required().messages({
			'any.required': 'Order number is required.',
			'string.empty': 'Order number cannot be empty.'
		})
	}).required(),
	body: Joi.object({}).optional(),
	query: Joi.object({}).optional()
});

/**
 * Joi schema for searching by payment session ID (Admin)
 */
export const paymentSessionIdSchema = Joi.object({
	params: Joi.object({
		sessionId: Joi.string().trim().required().messages({
			'any.required': 'Payment session ID is required.',
			'string.empty': 'Payment session ID cannot be empty.'
		})
	}).required(),
	body: Joi.object({}).optional(),
	query: Joi.object({}).optional()
});