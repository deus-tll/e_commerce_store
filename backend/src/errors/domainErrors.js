export class DomainError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class DomainValidationError extends DomainError {
	constructor(message, type = "BAD_REQUEST") {
		super(message);
		this.type = type;
	}
}

export class EntityNotFoundError extends DomainError {
	constructor(entity, criteria) {
		const identifier = typeof criteria === 'object'
			? JSON.stringify(criteria).replace(/["{}]/g, '')
			: criteria;

		super(`${entity} not found with identifier/s: ${identifier}`);
		this.entity = entity;
		this.criteria = criteria;
	}
}