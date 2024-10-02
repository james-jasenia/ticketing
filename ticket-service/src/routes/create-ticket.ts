import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@jjgittix/common';
import { body } from 'express-validator';
const router = express.Router();

const validator = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0')
]

router.post('/api/tickets', validator, validateRequest, requireAuth, validator, (req: Request, res: Response) => {
    
    res.sendStatus(200);
});

export { router as createTicketRouter };