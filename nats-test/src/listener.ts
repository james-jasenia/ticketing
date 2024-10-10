import nats, { Stan } from 'node-nats-streaming';
import { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const subject = 'ticketing:created'

// Alternatively called stan (nats backwards)
const client = nats.connect(
    'ticketing', 
    randomBytes(4).toString('hex'),  // In a scenario where a micro service is horizontally scaling, you will need a dynamicly generated client id because nats will reject duplicated client ids attempting to connect.
    { 
        url: 'http://localhost:4222' 
    }
);

const options = client
    .subscriptionOptions()
    .setManualAckMode(true) // Set Manual Acknowledgement Mode = True - This means that you will need to manually acknowledge the message otherwise NATs will keep publishing.
    .setDeliverAllAvailable() // The first time a service is created, it will receive all of the historical events
    .setDurableName('') // This will keep a record of the events that have and have not been ackowledged by the subscriber

client.on('connect', () => {
    console.log("listener connected to nats");

    client.on('close', () => {
        console.log('NATS close')
        process.exit();
    });

    const subscription = client.subscribe(
        subject, 
        'queue-group', // By having this queue group here, if there is an interuption in a subscription, nats will no longer through out the durable record
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


// Close event to prevent NATs from hoping for a restart / recovery.
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());

abstract class Listener {
    
    abstract subject: string;
    abstract queueGroupName: string;
    private client: Stan;
    abstract onMessage(data: any, msg: Message): void;
    protected ackWait = 5 * 1000
    

    constructor(client: Stan) {
        this.client = client
    }

    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg: Message) => {
            console.log(`Message received ${this.subject}, ${this.queueGroupName}`)

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg)
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' 
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'));
    }
}