import { Coordinate } from "./types";

export class HitDetectionDebugger {

    public element: HTMLDivElement;

    constructor(rootElement: HTMLElement) {
        this.element = document.createElement("div");
        this.element.style.background = "red";
        this.element.style.width = "5px";
        this.element.style.height = "5px";
        this.element.style.position = "absolute";
        this.element.style.zIndex = "200";

        rootElement.appendChild(this.element);
    }

    public renderAt(location: Coordinate) {
        this.element.style.left = location.x + "px";
        this.element.style.top = location.y + "px";
    }
}
