import {DomainError} from "./DomainError.js";

export class ActionNotAllowedError extends DomainError {
	constructor(message = "Action not allowed") { super(message); }
}

export class UnauthenticatedError extends DomainError {
	constructor(message = "Unauthenticated", code = "UNAUTHENTICATED") {
		super(message);
		this.code = code;
	}
}

export class UnauthorizedError extends DomainError {
	constructor(message = "Unauthorized access") { super(message); }
}

export class TokenExpiredError extends UnauthenticatedError {
	constructor(message = "Token expired") { super(message, "TOKEN_EXPIRED"); }
}

export class InvalidTokenError extends UnauthenticatedError {
	constructor(message = "Invalid token") { super(message, "INVALID_TOKEN"); }
}

export class InvalidCredentialsError extends UnauthenticatedError {
	constructor(message = "Invalid credentials") { super(message, "INVALID_CREDENTIALS"); }
}

export class ForbiddenError extends UnauthorizedError {
	constructor(message = "Access forbidden") { super(message); }
}

export class AccountNotVerifiedError extends UnauthorizedError {
	constructor(message = "Account verification required") {
		super(message);
		this.code = "ACCOUNT_NOT_VERIFIED";
	}
}