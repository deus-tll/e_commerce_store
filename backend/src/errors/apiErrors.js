export class ApiError extends Error {
	constructor(message, status = 500, code = null) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.code = code;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends ApiError {
	constructor(message = "Bad Request") {
		super(message, 400);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
		super(message, 401, code);
	}
}

export class InvalidCredentialsError extends UnauthorizedError {
	constructor(message = "Invalid credentials") {
		super(message);
	}
}

export class TokenExpiredError extends UnauthorizedError {
	constructor(message = "Token expired") {
		super(message, "TOKEN_EXPIRED");
	}
}

export class InvalidTokenError extends UnauthorizedError {
	constructor(message = "Invalid token") {
		super(message);
	}
}

export class AccountNotVerifiedError extends UnauthorizedError {
	constructor(message = "Account not verified") {
		super(message);
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