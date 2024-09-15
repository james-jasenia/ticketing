abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract serialiseErrors(): { message: string, field?: string }[];

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}

export default CustomError;