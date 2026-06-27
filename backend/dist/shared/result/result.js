export class Result {
    isSuccess;
    isFailure;
    _value;
    _error;
    constructor(isSuccess, error, value) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this._error = error;
    }
    static ok(value) {
        return new Result(true, undefined, value);
    }
    static fail(error) {
        return new Result(false, error, undefined);
    }
    get value() {
        if (this.isFailure) {
            throw new Error("Cannot get value from a failure result. Error was: " + JSON.stringify(this._error));
        }
        return this._value;
    }
    get error() {
        if (this.isSuccess) {
            throw new Error("Cannot get error from a success result.");
        }
        return this._error;
    }
}
