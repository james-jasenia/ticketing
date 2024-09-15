import CustomError from "./custom-error";

class DatabaseConnectionError extends CustomError {

    statusCode = 500;
    reason = 'Error connecting to database';

    constructor() {
        super('Error connecting to database');

        // This is only required when dealing with JS built in types. Without it, console.log(err instanceof RequestValidationError); could return false. - Very important to keep in mind and something that is easily forgotten.
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serialiseErrors()  {
        return [
            { message: this.reason }
        ];
    }
}

export default DatabaseConnectionError;