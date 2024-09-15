import { ValidationError } from "express-validator";
import CustomError from "./custom-error";

class RequestValidationError extends CustomError {

    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request paramters');

        // This is only required when dealing with JS built in types. Without it, console.log(err instanceof RequestValidationError); could return false. - Very important to keep in mind and something that is easily forgotten.
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serialiseErrors() {
        return this.errors.map(error => {
            if (error.type === 'field') {
                return { message: error.msg, field: error.path }
            }

            return { message: 'Validation error', field: 'Unknown' };
        });
    }
}

export default RequestValidationError;