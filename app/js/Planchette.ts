import { HitDetectionDebugger } from "./HitDetectionDebugger";
import { Coordinate, Delta, DetectedItem } from "./types";

export class Planchette {

    public location: Coordinate;
    private _root: HTMLElement;
    private _hitDebugger: HitDetectionDebugger;

    private get scaledLocation() { return this.scaleCoordinate(this.location); }
    private get rightBound() { return this.scaledLocation.x + this.width; }
    private get bottomBound() { return this.scaledLocation.y + this.height; }

    private get width() { return this._root.clientWidth > 0 ? this._root.clientWidth : this.fromCss(this._root, "width"); }
    private get height() { return this._root.clientHeight > 0 ? this._root.clientHeight : this.fromCss(this._root, "height"); }
    private get halfWidth() { return this.width / 2; }
    private get halfHeight() { return this.height / 2; }

    private get parent() { return this._root.parentElement; }
    private get parentBoardWidth() { return this.parent.clientWidth > 0 ? this.parent.clientWidth : this.fromCss(this.parent, "width"); }
    private get parentBoardHeight() { return this.parent.clientHeight > 0 ? this.parent.clientHeight : this.fromCss(this.parent, "height"); }
    private get parentBoardMargin() {
        const adjusted = (window.innerWidth - this.parentBoardWidth) / 2;
        return adjusted <= 0 ? 0 : adjusted;
    }

    constructor(location: Coordinate, element: HTMLElement) {
        this.location = location;
        this._root = element;

        this._hitDebugger = new HitDetectionDebugger(this._root.parentElement);
    }

    public centre() {
        this.location.x = 489;
        this.location.y = 355;
    }

    public move(delta: Delta): void {
        this.location.x += delta.deltaX;
        this.location.y += delta.deltaY;
        this.snapToBoundaries();
    }

    public focusOn(item: DetectedItem) {
        const scaled = this.scaleCoordinate(item.focalPoint);
        const viewFinderCentre = this.viewfinderTarget;

        const diffX = scaled.x - viewFinderCentre.x;
        const diffY = scaled.y - viewFinderCentre.y;

        this.location.x = this.location.x + diffX;
        this.location.y = this.location.y + diffY;
    }

    public render() {
        const pixelFloored: Coordinate = {
            x: Math.floor(this.scaledLocation.x),
            y: Math.floor(this.scaledLocation.y)
        };

        this._root.style.transform = `translate(${pixelFloored.x}px, ${pixelFloored.y}px)`;
        this._hitDebugger?.renderAt(this.viewfinderTarget);
    }

    public reveal(): DetectedItem | null {
        const itemsAtLocation = [...this.detectElementsAt(this.viewfinderTarget)];

        if (itemsAtLocation.length == 0) {
            return null;
        }

        const first = itemsAtLocation[0];
        const item = first.getAttribute("data-item");

        const focusParts = first.getAttribute("data-focus").split(',');
        const detectionPoint = {
            x: parseInt(focusParts[0]),
            y: parseInt(focusParts[1])
        };

        return { text: item, focalPoint: detectionPoint };
    }

    private snapToBoundaries() {
        const boundaries = {
            top: 0,
            left: 0 - this.halfWidth,
            bottom: this.parentBoardHeight + this.halfHeight,
            right: this.parentBoardWidth + this.halfWidth
        };

        const snapPoints = {
            top: 0,
            left: 0 - this.halfWidth,
            bottom: this.parentBoardHeight - this.halfHeight,
            right: this.parentBoardWidth - this.halfWidth
        };

        this.location.x = this.location.x <= boundaries.left ? snapPoints.left : this.location.x;
        this.location.x = this.rightBound <= boundaries.right ? this.location.x : snapPoints.right;
        this.location.y = this.location.y < boundaries.top ? snapPoints.top : this.location.y;
        this.location.y = this.bottomBound <= boundaries.bottom ? this.location.y : snapPoints.bottom;
    }

    private detectElementsAt(point: Coordinate): Element[] {
        const adjustedForWindowMargin = {
            x: point.x + this.parentBoardMargin,
            y: point.y
        };

        const elementsDetected = [...this._root.ownerDocument.elementsFromPoint(adjustedForWindowMargin.x, adjustedForWindowMargin.y)];
        return elementsDetected.filter(element => element.classList.contains("holder"));
    }

    private get viewfinderTarget(): Coordinate {
        const viewFinderCentreX = this.scaledLocation.x + this.halfWidth;

        const thisHeight = 33 * (this.height / 100);
        const viewFinderCentreY = this.scaledLocation.y + thisHeight;

        return { x: viewFinderCentreX, y: viewFinderCentreY };
    }

    private scaleCoordinate(coord: Coordinate) {
        const xPercent = coord.x / (1240 / 100);
        const yPercent = coord.y / (768 / 100);

        const onePercentXAtThisRes = this.parentBoardWidth / 100;
        const onePercentYAtThisRes = this.parentBoardHeight / 100;

        return { x: xPercent * onePercentXAtThisRes, y: yPercent * onePercentYAtThisRes };
    }

    private fromCss(parent: HTMLElement, property: string): number {
        return parseInt(parent.style[property].replace("px", ""))
    }
}