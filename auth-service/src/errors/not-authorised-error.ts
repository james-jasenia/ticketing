import CustomError from "./custom-error";

class NotAuthorisedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authorised');

        Object.setPrototypeOf(this, NotAuthorisedError.prototype);
    }

    serialiseErrors(): { message: string; field?: string; }[] {
        return [{ message: 'Not authorised' }]
    }
}

export default NotAuthorisedError;