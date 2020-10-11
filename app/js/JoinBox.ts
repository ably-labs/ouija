export class JoinBox {

    private _root: HTMLElement;
    private _boardNameInput: HTMLInputElement;

    constructor(element: string | HTMLElement) {
        this._root = typeof element === "string" ? this._root = document.getElementById(element) : element;
        this._boardNameInput = <HTMLInputElement>this._root.ownerDocument.getElementById("boardName");
    }

    hide() {
        this._root.classList.add("hidden");
    }

    show() {
        this._root.classList.remove("hidden");
    }

    setBoardName(boardName: string) {
        this._boardNameInput.value = boardName;
    }
}