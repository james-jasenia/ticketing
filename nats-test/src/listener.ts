import nats from 'node-nats-streaming';
import { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const subject = 'ticketing:created'
const queueGroup = 'ticketing:created:listener-queue-group'

// Alternatively called stan (nats backwards)
const client = nats.connect(
    'ticketing', 
    randomBytes(4).toString('hex'),  // In a scenario where a micro service is horizontally scaling, you will need a dynamicly generated client id because nats will reject duplicated client ids attempting to connect.
    { 
        url: 'http://localhost:4222' 
    }
);

const options = client.subscriptionOptions()
    .setManualAckMode(true); // Set Manual Acknowledgement Mode = True - This means that you will need to manually acknowledge the message otherwise NATs will keep publishing.

client.on('connect', () => {
    console.log("listener connected to nats");

    const subscription = client.subscribe(
        subject, 
        queueGroup,
        options
    )

    subscription.on('message', (msg: Message) => {
       const subject = msg.getSubject();
       const data = msg.getData();

       console.log(`${subject}`);
       console.log(`${data}`);

       msg.ack() // Acknowledge the emissions to stop NATs from fallback publishing.
    });
}); 