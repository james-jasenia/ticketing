class DatabaseConnectionError extends Error {

    reason = 'Error connecting to database';

    constructor() {
        super();

        // This is only required when dealing with JS built in types. Without it, console.log(err instanceof RequestValidationError); could return false. - Very important to keep in mind and something that is easily forgotten.
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
}

export default DatabaseConnectionError;