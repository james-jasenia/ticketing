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
    } else {
        next();
    }
};


export default errorHandler;