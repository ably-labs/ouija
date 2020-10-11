import { JoinBox } from "../../app/js/JoinBox";

describe("Join box", () => {

    let doc: HTMLDocument;
    let ele: HTMLElement;
    let sut: JoinBox;

    beforeEach(() => {

        doc = document.implementation.createHTMLDocument("New doc");
        doc.body.innerHTML = `
        <section id="join" class="join hidden">
            <h1>Join a Seance</h1>
            <form id="joinForm" class="join-form">
                <label for="boardName">Enter a board name: </label>
                <input id="boardName" name="boardName" type="text" />
                <button id="joinBtn" class="join-button" type="submit">Join board</button>
            </form> 
        </section>
        `;

        ele = doc.getElementById("join");;
        sut = new JoinBox(ele);
    })

    it("constructor does not throw", async () => {
        expect(() => {
            new JoinBox(ele);
        }).not.toThrow();
    });

    it("setBoardName, provided string, sets text box value", () => {
        sut.setBoardName("some name");

        const input = <HTMLInputElement>doc.getElementById("boardName");
        expect(input.value).toBe("some name");
    });

    it("hide, adds hidden class", () => {
        sut.hide();

        expect(ele.classList.contains("hidden")).toBe(true);
    });

    it("show, removes hidden class", () => {
        sut.show();

        expect(ele.classList.contains("hidden")).toBe(false);
    });
});