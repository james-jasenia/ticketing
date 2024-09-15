import CustomError from "./custom-error";

class NotFoundError extends CustomError {

    statusCode = 404;
    reason = 'Not found';

    constructor() {
        super('Route not found');

        // This is only required when dealing with JS built in types. Without it, console.log(err instanceof RequestValidationError); could return false. - Very important to keep in mind and something that is easily forgotten.
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serialiseErrors()  {
        return [
            { message: this.reason }
        ];
    }
}

export default NotFoundError;