import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import RequestValidationError from '../errors/request-validation-error';
import validateReqest from '../middlewares/validate-request';

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

router.post('/api/users/signin', validator, validateReqest, (req: Request, res: Response) => {
});

export { router as signinRouter };