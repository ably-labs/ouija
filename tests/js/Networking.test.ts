import { Types } from 'ably';
import { Networking } from "../../app/js/Networking"

describe("Networking", () => {

    let sut: Networking;
    let fakeAblyChannel: FakeAblyChannel;

    beforeEach(() => {
        fakeAblyChannel = new FakeAblyChannel();
        sut = new Networking(fakeAblyChannel.client);
    });

    it("connect, adds a subscription handler to ably", async () => {
        await sut.connect("boardId");

        expect(fakeAblyChannel.subscriptionCallback).not.toBeNull();
    });

    it("connect, publishes a join message", async () => {
        await sut.connect("boardId");

        expect(fakeAblyChannel.sentMessages[0].name).toBe("join");
    });

    it("on, registers a callback handler", async () => {
        await sut.connect("boardId");

        let called = false;
        sut.on("myMessageType", () => { called = true; });

        fakeAblyChannel.publish({ name: "myMessageType", data: {} });

        expect(called).toBe(true);
    });

    it("sendBufferedMessage, buffer limit not reached, collects messages to send", async () => {
        await sut.connect("boardId");
        fakeAblyChannel.sentMessages = [];

        sut.sendBufferedMessage("foo", {});

        expect(fakeAblyChannel.sentMessages.length).toBe(0);
    });

    it("sendBufferedMessage, buffer limit reached, sends messages in bulk", async () => {
        await sut.connect("boardId");
        fakeAblyChannel.sentMessages = [];

        for (let i = 0; i < 150; i++) {
            sut.sendBufferedMessage("foo", {});
        }

        expect(fakeAblyChannel.sentMessages.length).toBe(1);
        expect(fakeAblyChannel.sentMessages[0].name).toBe("bulk");
        expect(fakeAblyChannel.sentMessages[0].data.length).toBe(150);
    });

    it("sendBufferedMessage, buffer limit not reached, sends everything it has after one second has elapsed", async () => {
        await sut.connect("boardId");
        fakeAblyChannel.sentMessages = [];

        sut.sendBufferedMessage("foo", {});
        await wait(1100);

        expect(fakeAblyChannel.sentMessages.length).toBe(1);
        expect(fakeAblyChannel.sentMessages[0].data.length).toBe(1);
    });
});

const wait = (duration: number) => {
    return new Promise((res, rej) => { setTimeout(() => { res(true); }, duration); });
}

class FakeAblyChannel {
    public sentMessages: any[];
    public subscriptionCallback: CallableFunction;

    constructor() { this.sentMessages = [] }

    publish(message: any) {
        this.sentMessages.push(message);
        if (this.subscriptionCallback) {
            this.subscriptionCallback(message);
        }
    }

    subscribe(cb: CallableFunction) { this.subscriptionCallback = cb; }
    get client(): Types.RealtimePromise { return new FakeAbly(this) as any; }
}

class FakeAbly {
    public channels: any;
    constructor(channel: FakeAblyChannel) {
        this.channels = { get: (name: string) => { return channel; } }
    }
}