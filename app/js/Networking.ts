import { Types } from 'ably';
import Ably from 'ably/promises';

export type MessageHandler = (message: Ably.Types.Message) => void;

export class Networking {

    private _ably: Types.RealtimePromise;
    private _channel: Types.RealtimeChannelPromise;
    private _handlers: Map<string, MessageHandler>;

    private _outboundBuffer: any[];
    private _bufferCap: number = 150;

    constructor(ablyClient: Types.RealtimePromise = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' })) {
        this._ably = ablyClient;
        this._handlers = new Map<string, MessageHandler>();

        this._outboundBuffer = [];
        setInterval(() => { this.flushBuffer(); }, 1000);
    }

    async connect(id: string) {
        this._channel = this._ably.channels.get(`spiritboard-${id}`);
        this._channel.publish({ name: "join", data: {} });

        await this._channel.subscribe((message: Ably.Types.Message) => {

            const messagesToProcess = message.name == "bulk" ? [...message.data] : [message];

            for (let msg of messagesToProcess) {
                const handler = this._handlers[msg.name];
                handler?.(msg);
            }
        });
    };

    public on(messageName: string, callback: MessageHandler) {
        this._handlers[messageName] = callback;
    }

    public sendBufferedMessage(type: string, data: any): void {
        this._outboundBuffer.push({ name: type, data: data });

        if (this._outboundBuffer.length >= this._bufferCap) {
            this.flushBuffer();
        }
    }

    private flushBuffer() {
        if (this._outboundBuffer.length > 0) {
            this._channel.publish({ name: "bulk", data: this._outboundBuffer });
            this._outboundBuffer = [];
        }
    }
}