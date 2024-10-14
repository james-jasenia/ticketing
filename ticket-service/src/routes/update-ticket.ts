import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, NotAuthorisedError } from '@jjgittix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import TicketUpdatedPublisher from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

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

    await ticket.save()

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })

    res.send(ticket);
});

export { router as updateTicketRouter };