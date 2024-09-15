import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';

function errorHandler(
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    if(err instanceof CustomError) {
        res.status(err.statusCode).send({ errors: err.serialiseErrors() });
    }

    res.status(200).send({});
};


export default errorHandler;