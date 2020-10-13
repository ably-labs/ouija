export type OnCallbackInterval = (mostUsedCharacter: string) => void;

export class BatchingTextBuffer {

    private _threshold: number;
    private _values: Map<string, number>;
    private _callback: OnCallbackInterval | null;

    constructor(threshold: number) {
        this._threshold = threshold;
        this._values = new Map<string, number>();
        this._callback = null;
    }

    public mostPopularLetterEvent(onCallbackInterval: OnCallbackInterval) {
        this._callback = onCallbackInterval;
    }

    public injest(text: string) {
        this.indexString(text.toLowerCase());

        if (this.bufferIsFull()) {

            const mostUsed = this.mostUsedLetterInBuffer();

            if (this._callback) {
                this._callback(mostUsed);
            }

            this._values.clear();
        }
    }

    private indexString(text: string) {
        const allowed = /^[a-zA-Z0-9]+$/

        for (let char of text.split('')) {
            if (!char.match(allowed)) {
                continue;
            }

            if (!this._values.has(char)) {
                this._values.set(char, 0);
            }

            let currentValue = <number>this._values.get(char);
            this._values.set(char, ++currentValue);
        }
    }

    private bufferIsFull() {
        let total = 0;
        this._values.forEach((num) => { total += num; });
        return total >= this._threshold;
    }

    private mostUsedLetterInBuffer(): string {
        let maxNumber = { character: "", count: -Infinity };

        this._values.forEach((number, key) => {
            maxNumber = number > maxNumber.count
                ? { character: key, count: number }
                : maxNumber;
        });

        return maxNumber.character;
    }
}