import Joi from "joi";

import {UserRoles} from "../../constants/app.js";

// --- Exported Reusable Joi Schemas ---

// Reusable schema for a single image URL
export const imageSchema = Joi.string().trim().uri().messages({
	'string.uri': 'Image must be a valid URL.'
});

// 1. User ID (for params)
export const userIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'User ID is required in URL parameters.',
		'string.empty': 'User ID cannot be empty.',
		'string.base': 'User ID must be a string.'
	});

// 2. User Role
export const userRole = Joi.string()
	.trim()
	.valid(UserRoles.CUSTOMER, UserRoles.ADMIN)
	.messages({
		'any.only': `Role must be one of: ${UserRoles.CUSTOMER}, ${UserRoles.ADMIN}.`,
		'string.base': 'Role must be a string.'
	});

// 3. Name (required for creation/signup, optional for update)
export const userNameSchema = Joi.string()
	.trim()
	.min(2)
	.max(100)
	.messages({
		'string.empty': 'Name cannot be empty.',
		'string.min': 'Name must be at least 2 characters long.',
		'string.max': 'Name cannot exceed 100 characters.'
	});

// 4. Email (required for creation/login/forgot password)
export const emailSchema = Joi.string()
	.trim()
	.email()
	.messages({
		'string.empty': 'Email cannot be empty.',
		'string.email': 'Email must be a valid email address.'
	});

// 5. Password (required for creation/login/reset)
export const passwordSchema = Joi.string()
	.min(6)
	.messages({
		'string.empty': 'Password cannot be empty.',
		'string.min': 'Password must be at least 6 characters long.'
	});

// 6. Verification Code (for email verification)
export const verificationCodeSchema = Joi.string()
	.trim()
	.length(6) // Assuming a 6-character code
	.messages({
		'string.empty': 'Verification code cannot be empty.',
		'string.length': 'Verification code must be 6 characters long.'
	});

// 7. Product ID (for params)
export const productIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Product ID is required in URL parameters.',
		'string.empty': 'Product ID cannot be empty.',
		'string.base': 'Product ID must be a string.'
	});

// 8. Review ID (for params)
export const reviewIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Review ID is required in URL parameters.',
		'string.empty': 'Review ID cannot be empty.',
		'string.base': 'Review ID must be a string.'
	});

// 9. Review Rating (1 to 5)
export const reviewRatingSchema = Joi.number()
	.integer()
	.min(1)
	.max(5)
	.messages({
		'number.base': 'Rating must be a number.',
		'number.integer': 'Rating must be an integer.',
		'number.min': 'Rating must be 1 or greater.',
		'number.max': 'Rating cannot exceed 5.'
	});

// 10. Review Comment
export const reviewCommentSchema = Joi.string()
	.trim()
	.min(1)
	.max(500)
	.messages({
		'string.empty': 'Comment cannot be empty.',
		'string.min': 'Comment cannot be empty.',
		'string.base': 'Comment must be a string.',
		'string.max': 'Comment cannot exceed 500 characters.'
	});

// 11. Category ID (for body)
export const categoryIdSchema = Joi.string()
	.trim()
	.min(1)
	.messages({
		'string.empty': 'Category ID cannot be empty.',
		'string.base': 'Category ID must be a string.'
	});

// 12. Price (positive number)
export const priceSchema = Joi.number()
	.precision(2)
	.strict()
	.min(0.01)
	.messages({
		'number.base': 'Price must be a number.',
		'number.min': 'Price must be greater than zero.',
		'number.precision': 'Price can have a maximum of two decimal places.'
	});

// 13. Product Name
export const productNameSchema = Joi.string()
	.trim()
	.min(1)
	.max(255)
	.messages({
		'string.empty': 'Product name cannot be empty.',
		'string.base': 'Product name must be a string.'
	});

// 14. Product Description (used for creation/update)
export const descriptionSchema = Joi.string()
	.trim()
	.min(1)
	.max(2000)
	.messages({
		'string.empty': 'Product description cannot be empty.',
		'string.base': 'Product description must be a string.'
	});

// 15. Images Object
export const createProductImagesSchema = Joi.object({
	mainImage: imageSchema.required().messages({
		'any.required': 'Main image URL is required.'
	}),
	additionalImages: Joi.array().items(imageSchema)
		.default([])
		.messages({
			'array.base': 'Additional images must be an array of URLs.'
		}),
}).messages({
	'object.base': 'Images must be a valid object.',
});

export const updateProductImagesSchema = Joi.object({
	mainImage: imageSchema.optional(),
	additionalImages: Joi.array().items(imageSchema).optional(),
}).messages({
	'object.base': 'Images must be a valid object.',
});

// 16. Product Item for Checkout
export const checkoutProductItemSchema = Joi.object({
	id: Joi.string()
		.trim()
		.required()
		.messages({
			'any.required': 'Product ID is required for each item.',
			'string.empty': 'Product ID cannot be empty.',
		}),
	quantity: Joi.number()
		.integer()
		.min(1)
		.default(1)
		.messages({
			'number.base': 'Quantity must be a number.',
			'number.integer': 'Quantity must be an integer.',
			'number.min': 'Quantity must be 1 or greater.',
		}),
}).required().unknown(false);

// 17. Category ID (for params)
export const categoryIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Category ID is required in URL parameters.',
		'string.empty': 'Category ID cannot be empty.',
		'string.base': 'Category ID must be a string.'
	});

// 18. Category Name
export const categoryNameSchema = Joi.string()
	.trim()
	.min(1)
	.max(100)
	.messages({
		'string.empty': 'Category name cannot be empty.',
		'string.base': 'Category name must be a string.'
	});

// 18. Empty params and body validator
export const emptyParamAndBody = {
	params: Joi.object({}).optional(),
	body: Joi.object({}).optional(),
};

// 19. Stock (non-negative integer)
export const stockSchema = Joi.number()
	.integer()
	.min(0)
	.messages({
		'number.base': 'Stock must be a number.',
		'number.integer': 'Stock must be an integer.',
		'number.min': 'Stock cannot be negative.'
	});

// 20. Attribute Schema (for the Product's attributes array)
export const attributeItemSchema = Joi.object({
	name: Joi.string().trim().min(1).required().messages({
		'any.required': 'Attribute name is required.',
		'string.empty': 'Attribute name cannot be empty.'
	}),
	value: Joi.string().trim().min(1).required().messages({
		'any.required': 'Attribute value is required.',
		'string.empty': 'Attribute value cannot be empty.'
	})
});

// 21. Allowed Attribute Names (for Category create and update)
export const allowedAttributesSchema = Joi.array()
	.items(Joi.string().trim().min(1))
	.messages({
		'array.base': 'Allowed attributes must be an array of strings.'
	});

// 22. Category Slug (for params)
export const categorySlugParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Category Slug is required in URL parameters.',
		'string.empty': 'Category Slug cannot be empty.',
		'string.base': 'Category Slug must be a string.'
	});