import { Request, Response, NextFunction } from 'express';
import NotAuthorisedError from '../errors/not-authorised-error';

function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(!req.currentUser) {
        throw new NotAuthorisedError();
    }

    next();
};

export default requireAuth;