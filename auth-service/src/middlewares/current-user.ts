import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

interface UserPayload {
    id: string;
    email: string;
}

// This is more or less equivalent to extension Request { var currentUser: UserPayload? get{}set{} } 
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}


function currentUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch (err) {}

    next();
}

export default currentUser;