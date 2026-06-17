import {DomainError} from "./BaseError.js";
import {ValidationErrorType} from "../enums/error.js";

export class ValidationError extends DomainError {
    public readonly type: ValidationErrorType;

    constructor(message: string, type: ValidationErrorType = ValidationErrorType.BAD_REQUEST) {
        super(message);
        this.type = type;
    }
}