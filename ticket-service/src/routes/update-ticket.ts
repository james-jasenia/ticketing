import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, NotAuthorisedError } from '@jjgittix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

const validator = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
];

router.put('/api/tickets/:id', requireAuth, validator, validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        throw new NotFoundError();
    }

    if (req.currentUser!.id !== ticket.userId) {
        throw new NotAuthorisedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();

    res.send(ticket);
});

export { router as updateTicketRouter };