import {DomainError} from "./BaseError.js";
import {AuthErrorCode} from "../enums/error.js";

export class ActionNotAllowedError extends DomainError {
	constructor(message = "Action not allowed") { super(message); }
}

export class UnauthenticatedError extends DomainError {
	public readonly code: AuthErrorCode;

	constructor(message = "Unauthenticated", code: AuthErrorCode = AuthErrorCode.UNAUTHENTICATED) {
		super(message);
		this.code = code;
	}
}

export class UnauthorizedError extends DomainError {
	constructor(message = "Unauthorized access") { super(message); }
}

export class TokenExpiredError extends UnauthenticatedError {
	constructor(message = "Token expired") { super(message, AuthErrorCode.TOKEN_EXPIRED); }
}

export class InvalidTokenError extends UnauthenticatedError {
	constructor(message = "Invalid token") { super(message, AuthErrorCode.INVALID_TOKEN); }
}

export class InvalidCredentialsError extends UnauthenticatedError {
	constructor(message = "Invalid credentials") { super(message, AuthErrorCode.INVALID_CREDENTIALS); }
}

export class ForbiddenError extends UnauthorizedError {
	constructor(message = "Access forbidden") { super(message); }
}

export class AccountNotVerifiedError extends UnauthorizedError {
	constructor(message = "Account verification required") { super(message); }
}