export class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NotFoundError extends DomainError {
    constructor(message) {
        super(message);
    }
}
export class ValidationError extends DomainError {
    constructor(message) {
        super(message);
    }
}
export class UnauthorizedError extends DomainError {
    constructor(message) {
        super(message);
    }
}
