import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if(!this._client) {
            throw new Error('Cannot connect to NATS client before ready');
        }

        return this._client
    }

    connect(clusterId: string, clinetId: string, url: string) {
        this._client = nats.connect(clusterId, clinetId, { url });

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('NATS client connected');
                resolve();

            })

            this.client.on('error', (err) => {
                console.log(`Failed to connect to NATS client ${err}`);
                reject(err);
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();