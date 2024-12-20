import { Message } from "node-nats-streaming";
import { OrderStatus, Subjects } from "@jjgittix/common";
import { Listener } from "@jjgittix/common";
import { TicketUpdatedEvent } from "@jjgittix/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data)

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        await ticket.save();

        msg.ack();
    }
}

export default TicketUpdatedListener;