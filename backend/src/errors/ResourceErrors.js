import {DomainError} from "./DomainError.js";
import {ValidationErrorTypes} from "../constants/errors.js";

export class DomainValidationError extends DomainError {
	constructor(message, type = ValidationErrorTypes.BAD_REQUEST) {
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

		// noinspection JSUnusedGlobalSymbols
		this.criteria = criteria;
	}
}

export class EntityAlreadyExistsError extends DomainError {
	constructor(entity, criteria) {
		const identifier = typeof criteria === 'object'
			? JSON.stringify(criteria).replace(/["{}]/g, '')
			: criteria;

		super(`${entity} already exists with identifier/s: ${identifier}`);
		this.entity = entity;

		// noinspection JSUnusedGlobalSymbols
		this.criteria = criteria;
	}
}