import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import { BadRequestError, validateRequest } from '@jjgittix/common';

const router = express.Router();

const validator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
]

router.post('/api/users/signup', validator, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        },
        process.env.JWT_KEY! // Start function has a check for the JWT_KEY. This is a force unwrap.
    );

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as signupRouter };