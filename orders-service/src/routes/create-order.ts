import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@jjgittix/common";

const router = express.Router()

const validators = [
    body('ticket')
        .not()
        .isEmpty()
        .withMessage('Ticket ID must be provided.'),
    
]

router.post('/api/orders', requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    res.send({})
})

export { router as createOrderRouter }