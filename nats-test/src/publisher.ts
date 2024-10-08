import nats from 'node-nats-streaming';

console.clear();

const subject = 'ticketing:created'

// Alternatively called stan (nats backwards)
const client = nats.connect(
    'ticketing', 
    'abc', 
    { 
        url: 'http://localhost:4222' 
    }
);


client.on('connect', () => {
    console.log("publisher connected to nats");

    const data = JSON.stringify({
        'id': 1,
        'name': 'ticket 1'
    });

    client.publish(subject, data, () => {
        console.log("published!");
    });
});