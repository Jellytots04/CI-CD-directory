
import { ShapeCard } from "./shapecard.js";

beforeAll(() => {
    document.body.innerHTML = `
    <template id="shape-card-template">
        <div class="card card-face-down">
            <svg>
                <circle />
                <rect />
                <polygon />
            </svg>
        </div>
    </template>
    `;
});

class TestBoardSize extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const board = this.getAttribute("size");
        const [rows, cols] = board.split("x").map(Number);

        const container = document.createElement("div");
        container.innerHTML = ShapeCard.getUniqueRandomCardsAsHTML((rows * cols) / 2, true);

        this.shadowRoot.appendChild(container);
    }
}

customElements.define("test-board-size", TestBoardSize);

test("test-board-size has 12 cards for 3x4", () => {

    const board = document.createElement("test-board-size");
    board.setAttribute("size", "3x4");
    document.body.appendChild(board); 

    console.log("board root", board.shadowRoot.innerHTML);

    const cards = board.shadowRoot.querySelectorAll("shape-card");
    expect(cards.length).toBe(12);
});
