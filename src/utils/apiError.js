class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); //override message
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // The error.stack property is a string describing the point in the code at which the Error was instantiated.
    if (stack) {
      this.stack = stack;
    } else {
      // Creates a .stack property on targetObject, which when accessed returns a string representing the location in the code at which Error.captureStackTrace() was called.
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
