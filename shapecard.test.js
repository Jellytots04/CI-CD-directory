
import { ShapeCard } from "./shapecard.js";

test('Ensure the cards can face up and face down.', () => {
    document.body.innerHTML = `
        <template id="shape-card-template">
            <style>
                .card { }
                .card-face-up { }
            </style>
            <div class="card"></div>
        </template>

        <shape-card></shape-card>`;
    const card = document.querySelector("shape-card");

    // Check if the card is facing down at the start
    expect(card.isFaceUp()).toBe(false);

    // Flip the card and check if its facing up
    card.flip();
    expect(card.isFaceUp()).toBe(true);

    // Flip the card back and check if its facing down
    card.flip();
    expect(card.isFaceUp()).toBe(false);
});
