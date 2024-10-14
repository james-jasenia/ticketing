import { Message } from 'node-nats-streaming' 
import Listener from "./base-listener";
import TicketCreatedEvent from './ticket-created-event';
import Subjects from './subjects';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data', data.id, data.title);
        msg.ack();
    }

}

export default TicketCreatedListener