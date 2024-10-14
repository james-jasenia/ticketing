import nats from 'node-nats-streaming';
import TicketCreatedPublisher from './events/ticket-created-publisher';

console.clear();

const subject = 'ticket:created'

// Alternatively called stan (nats backwards)
const client = nats.connect(
    'ticketing', 
    'abc', 
    { 
        url: 'http://localhost:4222' 
    }
);

client.on('connect', async () => {
    console.log("publisher connected to nats");

    const publish = new TicketCreatedPublisher(client);

    const data = {
        id: '1',
        title: 'ticket 2',
        price: 20
    };

    try {
        await publish.publish(data);
    } catch(err) {
        console.error(err);
    }
});