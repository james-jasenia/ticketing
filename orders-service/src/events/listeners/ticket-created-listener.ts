import { Message } from "node-nats-streaming";
import { OrderStatus, Subjects } from "@jjgittix/common";
import { Listener } from "@jjgittix/common";
import { TicketCreatedEvent } from "@jjgittix/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, title, price } = data;
        
        const ticket = Ticket.build({
            id, title, price
        });

        await ticket.save();

        msg.ack();
    }
}

export default TicketCreatedListener;