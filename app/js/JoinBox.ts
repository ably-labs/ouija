import { ConfigurationRepository } from "./ConfigurationRepository";

export class JoinBox {

    private _root: HTMLElement;
    private _boardNameInput: HTMLInputElement;
    private _musicToggleInput: HTMLInputElement;
    private _speechToggleInput: HTMLInputElement;
    private _configRepo: ConfigurationRepository;

    constructor(element: string | HTMLElement, configRepo: ConfigurationRepository) {
        this._root = typeof element === "string" ? this._root = document.getElementById(element) : element;
        this._configRepo = configRepo;

        this._boardNameInput = <HTMLInputElement>this._root.ownerDocument.getElementById("boardName");
        this._musicToggleInput = <HTMLInputElement>this._root.ownerDocument.getElementById("musicToggle");
        this._speechToggleInput = <HTMLInputElement>this._root.ownerDocument.getElementById("speechToggle");

        this.wireUpAudioConfigToggles();
    }

    public hide() {
        this._root.classList.add("hidden");
    }

    public show() {
        this._root.classList.remove("hidden");
    }

    public setBoardName(boardName: string) {
        this._boardNameInput.value = boardName;
    }

    private wireUpAudioConfigToggles() {
        const config = this._configRepo.load(() => ({ enableSpeech: true, enableMusic: true }));

        this._musicToggleInput.checked = config.enableMusic;
        this._speechToggleInput.checked = config.enableSpeech;

        this._musicToggleInput.addEventListener("change", (e: any) => {
            config.enableMusic = e.target.checked;
            this._configRepo.save(config);
        });

        this._speechToggleInput.addEventListener("change", (e: any) => {
            config.enableSpeech = e.target.checked;
            this._configRepo.save(config);
        });
    }
}