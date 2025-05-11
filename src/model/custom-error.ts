export class RequestError extends Error {
  constructor(message: string, cause: number) {
    super(message);
    this.name = 'RequestError';
    this.message = message;
    this.cause = cause;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
