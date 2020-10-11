import { Networking } from "./Networking";
import { Planchette } from "./Planchette";
import { Delta, DetectedItem } from "./types";

export type RevealedItemCallback = (item: DetectedItem) => void;
declare const Gyroscope: any;

export class SpiritBoard {

    public planchette: Planchette;
    public blockMovement: boolean;

    private _root: HTMLElement;
    private _animationElement: HTMLElement;

    private _networking: Networking;
    private _visible: boolean;
    private _lastItem: DetectedItem;

    private _revealedItemCallback: RevealedItemCallback;
    private _blockedMovementBuffer: Delta[];

    constructor(element: string | HTMLElement, networking: Networking) {

        this._root = typeof element === "string"
            ? this._root = document.getElementById(element)
            : element;

        this._networking = networking;

        const planchetteElement = this._root.ownerDocument.getElementById("planchette");
        this._animationElement = this._root.ownerDocument.getElementById("animation");

        this.planchette = new Planchette({ x: 0, y: 0 }, planchetteElement);
        this._blockedMovementBuffer = [];

        this._root.addEventListener("mousemove", (ev: MouseEvent) => { this.monitorMouse(ev); });
        this.enableGyroscope();
    }

    public show() {
        this._root.classList.remove("hidden");
        this._visible = true;
        this.planchette.centre();
        this.render();
    }

    public movePlanchette(movement: Delta) {
        if (this.blockMovement) {
            this._blockedMovementBuffer.push(movement);
            return;
        }

        this.planchette.move(movement);
    }

    public onReveal(onRevealCallback: RevealedItemCallback) {
        this._revealedItemCallback = onRevealCallback;
    }

    public spookyAnimate(value: string, duration: number = 3_000) {
        this._animationElement.innerHTML = value;
        this._animationElement.classList.add('animate');
        setTimeout(() => { this._animationElement.classList.remove('animate'); }, duration);
    }

    private render() {
        this.planchette.render();
        this.raiseEventsForNewlyRevealedItems();

        if (this._visible) {
            window.requestAnimationFrame(() => this.render());
        }
    }

    private raiseEventsForNewlyRevealedItems() {
        const revealedItem = this.planchette.reveal();
        if (revealedItem == null) {
            return;
        }

        if (revealedItem.text == this._lastItem?.text) {
            return;
        }

        this._lastItem = revealedItem;
        this.temporarilyBlockMovement(3_000);

        this.planchette.focusOn(revealedItem);

        if (this._revealedItemCallback) {
            this._revealedItemCallback(revealedItem);
        }
    }

    private monitorMouse(event: MouseEvent) {
        this._networking.sendBufferedMessage("nudge", { deltaX: event.movementX, deltaY: event.movementY });
    }

    private temporarilyBlockMovement(duration: number) {
        this.blockMovement = true;

        setTimeout(() => {
            this.blockMovement = false;

            for (let delta of this._blockedMovementBuffer) {
                this.movePlanchette(delta);
            }

            this._blockedMovementBuffer = [];

        }, duration);
    }

    private enableGyroscope() {
        if (typeof Gyroscope !== "function") {
            return;
        }

        let gyroscope = new Gyroscope({ frequency: 60 });
        gyroscope.addEventListener('reading', (e: any) => {
            const effectiveX = (gyroscope.x) * 10;
            const effectiveY = (gyroscope.y * -1) * 10;
            this._networking.sendBufferedMessage("nudge", { deltaX: effectiveX, deltaY: effectiveY });
        });
        gyroscope.start();
    }
}
