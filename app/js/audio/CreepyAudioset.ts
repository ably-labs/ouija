import { AudioSet } from "./AudioSet";

export class CreepyAudioset extends AudioSet {
    constructor() {
        const offsets = new Map<string, number>();
        offsets.set("a", 0);
        offsets.set("b", 2);
        offsets.set("c", 4);
        offsets.set("d", 6);
        offsets.set("e", 8);
        offsets.set("f", 10);
        offsets.set("g", 12.5);
        offsets.set("h", 14.5);
        offsets.set("i", 16.5);
        offsets.set("j", 18.5);
        offsets.set("k", 20.5);
        offsets.set("l", 22.5);
        offsets.set("m", 24.5);
        offsets.set("n", 26.5);
        offsets.set("o", 28.5);
        offsets.set("p", 30.5);
        offsets.set("q", 32.5);
        offsets.set("r", 34.5);
        offsets.set("s", 36.5);
        offsets.set("t", 38.5);
        offsets.set("u", 40.5);
        offsets.set("v", 42.5);
        offsets.set("w", 44.5);
        offsets.set("x", 46.5);
        offsets.set("y", 48.5);
        offsets.set("z", 51);

        super("/audio/alpha.ogg", offsets, 1500);
    }
}
