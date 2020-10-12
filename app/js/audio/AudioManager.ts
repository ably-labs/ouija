import { Configuration, DetectedItem } from "../types";
import { AudioSet } from "./AudioSet";
import { ProfessionalAudioset } from "./ProfessionalAudioset";

export class AudioManager {

    private _config: Configuration;
    private _audio: HTMLAudioElement;
    private _letters: AudioSet;

    constructor(configuration: Configuration) {
        this._config = configuration;
        this._audio = new Audio("/audio/dangerousound.ogg");
        this._letters = new ProfessionalAudioset();
        this._audio.volume = 0.02;
        this._audio.loop = true;
    }

    public playAmbientAudio(): void {
        if (!this._config.enableMusic) {
            return;
        }

        this._audio.play();
    }

    public voiceItem(item: DetectedItem): void {
        if (!this._config.enableSpeech) {
            return;
        }

        if (!this._letters.supports(item.text)) {
            return;
        }

        this._letters.play(item.text);
    }
}

