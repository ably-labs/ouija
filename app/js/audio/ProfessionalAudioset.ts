import { AudioSet } from "./AudioSet";

export class ProfessionalAudioset extends AudioSet {
    constructor() {

        const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'yes', 'no', 'goodbye'];
        const offsets = new Map<string, number>();
        let current = 0;
        for (let i = 0; i < items.length; i++) {
            offsets.set(items[i], current);
            current += 5;
        }

        super("/audio/alpha-matt-both.ogg", offsets, 3000);
    }
}
