export class DomainError extends Error {
	public readonly name: string;

	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	}
}