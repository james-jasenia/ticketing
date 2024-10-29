import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@jjgittix/common";
import TicketUpdatedListener from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'any title',
        price: 10
    })

    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: ticket.title,
        price: ticket.price,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg }
}

it('binds, updated and saves a ticket', async () =>  {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('it acks the message', async () =>  {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, ticket, data, msg } = await setup();
    data.version = 10

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});