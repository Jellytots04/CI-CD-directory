import {ShapeCard} from './shapecard.js';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDJHe8gg748anQ1ewdw91BJ-GE8eBLHo2U",
    authDomain: "rwatc22531133.firebaseapp.com",
    projectId: "rwatc22531133",
    storageBucket: "rwatc22531133.firebasestorage.app",
    messagingSenderId: "574196525692",
    appId: "1:574196525692:web:ff34e80dfaa95138f937f9",
    measurementId: "G-BCHDR565YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveClickScore(clicks) {
    await addDoc(collection(db, "ClickScore"), {
    clicks,
    timestamp: new Date()
    });
}

export async function fetchAverageClicks() {
    const list = await getDocs(collection(db, "ClickScore"));
    let total = 0;
    list.forEach(doc => {
    total += doc.get("clicks");
    });
    return list.size === 0 ? 0 : Math.floor(total / list.size);
}
// Custom elements made here
class boardSize extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const board = this.getAttribute("size");

        const [rows, cols] = board.split("x").map(Number);

        this.rows = rows;
        this.cols = cols;
        
        const container = document.createElement("div");

        container.style.display = "grid";
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        container.style.gap = "5px";

        this.shadowRoot.appendChild(container);
        this.board = container;

        const winOverlay = document.createElement("div");
        winOverlay.style.position = "fixed";
        winOverlay.style.top = "50%";
        winOverlay.style.left = "50%";
        winOverlay.style.transform = "translate(-50%, -50%)";
        winOverlay.style.display = "none";

        const winMessage = document.createElement("h1");
        winMessage.textContent = "You Win!";
        winOverlay.appendChild(winMessage);

        const UserScore = document.createElement("p");
        UserScore.textContent = "Clicks used : 0";
        winOverlay.appendChild(UserScore);

        const replay = document.createElement("button");
        replay.textContent = "Play Again!";
        replay.addEventListener("click", () => this.replay())
        winOverlay.appendChild(replay);

        const avgButton = document.createElement("button");
        avgButton.textContent = "Show Average Clicks";
        avgButton.addEventListener("click", () => this.showAverage())
        winOverlay.appendChild(avgButton);

        const avgScore = document.createElement("p");
        avgScore.textContent = "Average Clicks: 0";
        avgScore.style.display = "none";
        winOverlay.appendChild(avgScore);

        this.shadowRoot.appendChild(winOverlay);

        this.score = UserScore;
        this.overlay = winOverlay;
        this.board = container;
        this.avgScore = avgScore;

        this.startGame();
    }

    startGame() {
        const pairs = (this.rows * this.cols) / 2; 

        this.board.innerHTML = ShapeCard.getUniqueRandomCardsAsHTML(pairs, true);

        this.overlay.style.display = "none";
        this.avgScore.style.display = "none";
        
        // Will be used to store the cards that are currently up
        let cardsUp = [];
        let clicks = 0;
        let flippedCards = 0;

        this.board.querySelectorAll('shape-card').forEach(sc => sc.addEventListener('click', e => {
            if (e.target.isFaceUp()) {
                return;
            }

            clicks++;
            e.target.flip();
            cardsUp.push(e.target);

            if (cardsUp.length === 2) {
                const [c1, c2] = cardsUp;

                const typeMatch = c1.getAttribute('type') === c2.getAttribute('type');
                const colorMatch = c1.getAttribute('colour') === c2.getAttribute('colour');

                if (typeMatch && colorMatch) {
                    flippedCards += 2;
                    cardsUp = [];
                } else {
                    setTimeout(() => {
                        c1.flip();
                        c2.flip();
                        cardsUp = [];
                    }, 750);
                }
            }

            if (flippedCards === (this.rows * this.cols)) {
                setTimeout(async () => {
                    await saveClickScore(clicks);
                    this.gameWin(clicks);
                }, 1000);
            }

        }));
    }

    async showAverage() {
        const avg = await fetchAverageClicks();
        console.log(avg);
        // console.log("Total clicks: ", total);
        // console.log("Average clicks : ", Math.floor(total / list.size));
        this.avgScore.textContent = `Average Clicks: ${avg}`;
        this.avgScore.style.display = "block";
    }

    gameWin(count) {
        this.score.textContent = `Clicks used : ${count}`;
        this.avgScore.style.display = "none";
        this.overlay.style.display = "block";
    }

    replay() {
        this.startGame();
        console.log("Replay button debug print");
    }
}

customElements.define("board-size", boardSize);

