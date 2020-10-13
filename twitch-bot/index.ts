import * as tmi from "tmi.js";
import { BatchingTextBuffer } from "./BatchingTextBuffer";
import { Realtime } from 'ably/promises';

require('dotenv').config();

const opts = {
    identity: {
        username: <string>process.env.BOTNAME,
        password: <string>process.env.BOTPASSWORD
    },
    channels: [
        <string>process.env.CHANNEL
    ]
};

const ably = new Realtime(<string>process.env.ABLY_API_KEY);
const channel = ably.channels.get(<string>process.env.ABLY_CHANNEL);

const batchBuffer = new BatchingTextBuffer(parseInt(<string>process.env.BATCH_THRESHOLD))
batchBuffer.mostPopularLetterEvent((mostUsedCharacter) => {
    console.log("Snapping board to:", mostUsedCharacter);
    channel.publish({ name: "snap", data: mostUsedCharacter });
});

const client = tmi.client(opts);
client.on('connected', (addr: any, port: any) => { console.log(`* Connected to ${addr}:${port}`); });
client.on('message', (target: string, context: any, msg: string, self: any) => { batchBuffer.injest(msg); });
client.connect();

console.log("Ready");