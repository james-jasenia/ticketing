import { ValidationError } from "express-validator";

class RequestValidationError extends Error {

    constructor(public errors: ValidationError[]) {
        super();

        // This is only required when dealing with JS built in types. Without it, console.log(err instanceof RequestValidationError); could return false. - Very important to keep in mind and something that is easily forgotten.
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
}

export default RequestValidationError;