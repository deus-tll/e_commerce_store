export class ApiError extends Error {
	constructor(message, status = 500) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends ApiError {
	constructor(message = "Bad Request") {
		super(message, 400);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

export class PaymentRequiredError extends ApiError {
	constructor(message = "Payment Required") {
		super(message, 402);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message = "Forbidden") {
		super(message, 403);
	}
}

export class NotFoundError extends ApiError {
	constructor(message = "Not Found") {
		super(message, 404);
	}
}

export class ConflictError extends ApiError {
	constructor(message = "Conflict") {
		super(message, 409);
	}
}

export class GoneError extends ApiError {
	constructor(message = "Gone") {
		super(message, 410);
	}
}

export class InternalServerError extends ApiError {
	constructor(message = "Internal Server Error") {
		super(message, 500);
	}
}