import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/ticket-created-listener';

console.clear();

// Alternatively called stan (nats backwards)
const client = nats.connect(
    'ticketing', 
    randomBytes(4).toString('hex'),  // In a scenario where a micro service is horizontally scaling, you will need a dynamicly generated client id because nats will reject duplicated client ids attempting to connect.
    { 
        url: 'http://localhost:4222' 
    }
);

client.on('connect', () => {
    console.log("listener connected to nats");

    client.on('close', () => {
        console.log('NATS close')
        process.exit();
    });

    const listener = new TicketCreatedListener(client);
    listener.listen();
}); 

// Close event to prevent NATs from hoping for a restart / recovery.
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());