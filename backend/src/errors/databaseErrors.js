export class DatabaseError extends Error {
	constructor(message, originalError = null) {
		super(message);
		this.name = this.constructor.name;
		this.originalError = originalError;
		Error.captureStackTrace(this, this.constructor);
	}
}