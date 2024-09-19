import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import RequestValidationError from '../errors/request-validation-error';

const router = express.Router();

const validator = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
]

router.post('/api/users/signin', validator, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
});

export { router as signinRouter };