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
        const formattedErros = err.errors.map(error => {
            if (error.type === 'field') {
                return { message: error.msg, field: error.path }
            }
        });

        res.status(400).send({ errors: formattedErros });
    }

    if (err instanceof DatabaseConnectionError) {
        res.status(500).send({ error: [{ message: err.reason }] });
    }

    res.status(200).send({});
};


export default errorHandler;