import { Request, Response, NextFunction } from 'express';
import RequestValidationError from '../errors/request-validation-error';
import DatabaseConnectionError from '../errors/database-connection-error';

function errorHandler(
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    if(err instanceof RequestValidationError) {
        res.status(err.statusCode).send({ errors: err.serialiseErrors() });
    }

    if (err instanceof DatabaseConnectionError) {
        res.status(err.statusCode).send({ error: err.serialiseErrors() });
    }

    res.status(200).send({});
};


export default errorHandler;