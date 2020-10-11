import { Networking } from "../../app/js/Networking";
import { SpiritBoard } from "../../app/js/SpiritBoard";

describe("SpiritBoard", () => {

    let doc: HTMLDocument;
    let sut: SpiritBoard;
    let boardElement: HTMLElement;
    let fakeNetworking: Networking;

    beforeEach(() => {

        doc = document.implementation.createHTMLDocument("New doc");
        doc.elementsFromPoint = (x, y) => { return []; };
        doc.body.innerHTML = `
            <div id="activeBoard" style="width: 1240px; height: 768px;" class="hidden">
                <div id="planchette" style="width: 100px; height: 100px"></div>
                <div id="animation"></div>
            </div>
        `;

        boardElement = doc.getElementById("activeBoard");
        fakeNetworking = {} as any;

        sut = new SpiritBoard(boardElement, fakeNetworking);
    })

    it("constructor creates new planchette", async () => {
        expect(sut).toBeDefined();
    });

    it("show, removes hidden class from element", async () => {
        sut.show();

        expect(boardElement.classList.contains("hidden")).toBeFalsy();
    });

    it("onReveal, registers callback function that's called when a new element is revealed", async () => {
        let called = false;
        sut.planchette.reveal = () => { return { text: "oh hai", focalPoint: { x: 0, y: 0 } }; };

        sut.onReveal(() => { called = true });
        sut.show();

        expect(called).toBeTruthy();
    });

    it("onReveal, blocks movement for a three seconds", async () => {
        sut.planchette.reveal = () => { return { text: "oh hai", focalPoint: { x: 0, y: 0 } }; };

        sut.show();

        expect(sut.blockMovement).toBeTruthy();
        await wait(3_100);
        expect(sut.blockMovement).toBeFalsy();
    });

    it("movePlanchette, moves planchette", async () => {
        sut.movePlanchette({ deltaX: 1, deltaY: 0 });

        expect(sut.planchette.location).toStrictEqual({ x: 1, y: 0 });
    });

    it("movePlanchette, while movement blocked, does not move planchette", async () => {
        sut["temporarilyBlockMovement"](1000);

        sut.movePlanchette({ deltaX: 1, deltaY: 0 });

        expect(sut.planchette.location).toStrictEqual({ x: 0, y: 0 });
    });

    it("movePlanchette, after temporary block is removed, moves planchette", async () => {
        sut["temporarilyBlockMovement"](1000);

        sut.movePlanchette({ deltaX: 1, deltaY: 0 });

        expect(sut.planchette.location).toStrictEqual({ x: 0, y: 0 });
        await wait(1_100);
        expect(sut.planchette.location).toStrictEqual({ x: 1, y: 0 });
    });

    it("spookyAnimate, sets the innerHTML on the animation div", () => {
        sut.spookyAnimate("my text");

        expect(doc.getElementById("animation").innerHTML).toBe("my text");
    });

    it("spookyAnimate, adds an animate css class", () => {
        sut.spookyAnimate("my text");

        expect(doc.getElementById("animation").classList.contains("animate")).toBeTruthy();
    });

    it("spookyAnimate, removes animate css class after a timeout", async () => {
        sut.spookyAnimate("my text", 100);

        expect(doc.getElementById("animation").classList.contains("animate")).toBeTruthy();
        await wait(200);
        expect(doc.getElementById("animation").classList.contains("animate")).toBeFalsy();
    });
});

const wait = (duration: number) => {
    return new Promise((res, rej) => { setTimeout(() => { res(true); }, duration); });
}