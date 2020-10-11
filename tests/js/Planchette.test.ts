import "../../app/js/Planchette"
import { Planchette } from "../../app/js/Planchette";
import { Coordinate } from "../../app/js/types";

describe("Planchette", () => {

    let doc: HTMLDocument;
    let sut: Planchette;
    let planchetteElement: HTMLElement;
    let planchetteLocation: Coordinate;

    beforeEach(() => {
        doc = document.implementation.createHTMLDocument("New doc");
        doc.elementsFromPoint = (x, y) => { return []; };

        doc.body.innerHTML = `
            <div id="activeBoard" style="width: 1240px; height: 768px;">
                <div id="planchette" style="width: 100px; height: 100px"></div>
                <div id="animation"></div>
            </div>
        `;

        planchetteElement = doc.getElementById("planchette");
        planchetteLocation = { x: 0, y: 0 };

        sut = new Planchette(planchetteLocation, planchetteElement);
    })

    it("constructor creates new planchette", async () => {
        expect(sut).toBeDefined();
    });

    it("move, successfully moves planchette", async () => {
        sut.move({ deltaX: 300, deltaY: 300 });

        expect(sut.location).toStrictEqual({ x: 300, y: 300 });
    });

    it("move, from non-origin location, successfully moves planchette", async () => {
        sut.location = { x: 150, y: 200 };

        sut.move({ deltaX: 300, deltaY: 300 });

        expect(sut.location).toStrictEqual({ x: 450, y: 500 });
    });

    it("move, out of left border, can only move out by half the width of the planchette", async () => {
        sut.location = { x: 0, y: 0 };

        sut.move({ deltaX: -51, deltaY: 0 });

        expect(sut.location).toStrictEqual({ x: -50, y: 0 });
    });

    it("move, out of right border,  can only move out by half the width of the planchette", async () => {
        sut.location = { x: 1240, y: 0 };

        sut.move({ deltaX: 1, deltaY: 0 });

        // positioned to fit the whole plancette on the screen by being 100 px from the right border
        expect(sut.location).toStrictEqual({ x: 1190, y: 0 });
    });


    it("move, out of top border, doesn't go out of bounds", async () => {
        sut.location = { x: 0, y: 0 };

        sut.move({ deltaX: 0, deltaY: -1 });

        expect(sut.location).toStrictEqual({ x: 0, y: 0 });
    });

    it("move, out of bottom border, can go 50 pixels over (half the planchette height) to accomodate low-down letters", async () => {
        // 768 = max height
        // planchette = 100 px
        // half = 50 px overflow

        sut.location = { x: 0, y: 718 };

        sut.move({ deltaX: 0, deltaY: 1 });

        expect(sut.location).toStrictEqual({ x: 0, y: 718 });
    });

    it.skip("centre, puts the planchette in the middle of the board", async () => {
        sut.location = { x: 0, y: 0 };

        sut.centre();

        expect(sut.location).toStrictEqual({ x: 462, y: 334 });
    });

    it("render, adds transform at current location", async () => {
        sut.location = { x: 123, y: 456 };

        sut.render();

        expect(planchetteElement.style.transform).toBe("translate(123px, 456px)");
    });

    it("reveal, no items under planchette, returns null", () => {
        const result = sut.reveal();

        expect(result).toBeNull();
    });

    /* Fixthis
    it("reveal, returns item under planchette viewfinder", () => {
        const ele = elementAt({ x: 50, y: 33 }, 10, 10); // Sneakily position element right under the middle of the viewfinder
        ele.setAttribute("data-item", "some data");
        ele.classList.add("letter");
    
        planchetteElement.appendChild(ele);
        doc.elementsFromPoint = hitDetectionFor(ele);
    
        const result = sut.reveal();
    
        expect(result.text).toBe("some data");
    }); */
});

function elementAt(location: Coordinate, width: number, height: number): HTMLElement {
    const ele = document.createElement("div");
    ele.style.left = `${location.x}px`;
    ele.style.top = `${location.y}px`;
    ele.style.width = `${width}px`;
    ele.style.height = `${height}px`;
    return ele;
}

// This is an entirely fake implementation because there is no document!
function hitDetectionFor(ele: HTMLElement) {
    return (x: number, y: number) => {
        const minX = parseInt(ele.style.left.replace("px", ""));
        const minY = parseInt(ele.style.top.replace("px", ""));
        const maxX = minX + parseInt(ele.style.width.replace("px", ""));
        const maxY = minY + parseInt(ele.style.height.replace("px", ""));

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            return [ele];
        }
        return [];
    }
}