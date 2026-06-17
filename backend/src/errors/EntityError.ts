import {DomainError} from "./BaseError.js";

abstract class EntityError extends DomainError {
	public readonly entity: string;
	public readonly criteria: any;

	protected constructor(entity: string, criteria: any, messageTemplate: string) {
		const identifier = typeof criteria === 'object'
			? JSON.stringify(criteria).replace(/["{}]/g, '')
			: criteria;

		super(messageTemplate.replace("{entity}", entity).replace("{identifier}", identifier));

		this.entity = entity;
		this.criteria = criteria;
	}
}

export class EntityNotFoundError extends EntityError {
	constructor(entity: string, criteria: any) {
		super(entity, criteria, "{entity} not found with identifier/s: {identifier}");
	}
}

export class EntityAlreadyExistsError extends EntityError {
	constructor(entity: string, criteria: any) {
		super(entity, criteria, '{entity} already exists with identifier/s: {identifier}');
	}
}