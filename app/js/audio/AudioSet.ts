import { wait } from "../util";

export class AudioSet {
    public filename: string;
    public offsets: Map<string, number>;
    public segmentLength: number;
    public audio: HTMLAudioElement;

    constructor(filename: string, offsets: Map<string, number>, segmentLength: number) {
        this.filename = filename;
        this.offsets = offsets;
        this.segmentLength = segmentLength;
        this.audio = new Audio(filename);
    }

    public supports(key: string) {
        return this.offsets.has(key);
    }

    public async play(key: string) {
        const offset = this.offsets.get(key);
        this.audio.currentTime = offset;
        this.audio.volume = 0.1;

        this.audio.play();
        await wait(this.segmentLength);
        this.audio.pause();
    }
}
