import { AudioManager } from "../../../app/js/audio/AudioManager";
import { Configuration } from "../../../app/js/types";

describe("AudioManager", () => {

    let cfg: Configuration;
    let sut: AudioManager;

    beforeEach(() => {
        cfg = { enableMusic: true, enableSpeech: true };
        sut = new AudioManager(cfg);
    });

    it("Constructs", () => {
        expect(() => {
            new AudioManager(null);
        }).not.toThrow();
    });

    it("playAmbientAudio, enableMusic is true, plays audio.", () => {
        let wasCalled = false;
        sut["_audio"] = { play: () => { wasCalled = true; } } as any;

        sut.playAmbientAudio();

        expect(wasCalled).toBe(true);
    });

    it("playAmbientAudio, enableMusic is false, doesn't play audio.", () => {
        let wasCalled = false;
        sut["_audio"] = { play: () => { wasCalled = true; } } as any;
        cfg.enableMusic = false;

        sut.playAmbientAudio();

        expect(wasCalled).toBe(false);
    });

});