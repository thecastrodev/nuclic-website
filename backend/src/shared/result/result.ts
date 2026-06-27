export class Result<T, E = Error> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;
  }

  public static ok<U, F = Error>(value: U): Result<U, F>;
  public static ok<U = void, F = Error>(): Result<U, F>;
  public static ok<U, F = Error>(value?: U): Result<U, F> {
    return new Result<U, F>(true, undefined, value);
  }

  public static fail<U, F = Error>(error: F): Result<U, F> {
    return new Result<U, F>(false, error, undefined);
  }

  public get value(): T {
    if (this.isFailure) {
      throw new Error("Cannot get value from a failure result. Error was: " + JSON.stringify(this._error));
    }
    return this._value as T;
  }

  public get error(): E {
    if (this.isSuccess) {
      throw new Error("Cannot get error from a success result.");
    }
    return this._error as E;
  }
}
