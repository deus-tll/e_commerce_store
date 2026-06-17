export class BaseError extends Error {
    public readonly name: string;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

export class DomainError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

export class SystemError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}