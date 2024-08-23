import Game from "./Game.js";
import { NUM_TRIES } from "./scripts.js";
import ToastManager from "./ToastManager.js";

export default class GameController {
	#game = new Game();
	#toastManager = new ToastManager();
	#boardElement;
	#isChecking = false;
	#isGameOver = false;

	constructor() {
		this.#boardElement = document.getElementById("board");

		for (let i = 0; i < NUM_TRIES; ++i) {
			let row = document.createE;
		}

		this.#game.addBoardListener(this);
		this.#game.newGame();
	}

	key(key) {
		if (!this.#isChecking && !this.#isGameOver) this.#game.key(key);
	}

	delete() {
		if (!this.#isChecking && !this.#isGameOver) this.#game.delete();
	}

	guess() {
		if (this.#isChecking || this.#isGameOver) {
			this.#toastManager.toast("Please wait to guess");
			return false;
		}

		if (this.#game.checkValidWord()) {
			this.#toastManager.toast(this.#game.checkValidWord());
			return false;
		}

		this.#isChecking = true;
		this.#game.guess();
		setTimeout(() => {
			this.#isChecking = false;
		}, 900);

		return true;
	}

	onBoardCreated(board) {
		this.#boardElement.querySelectorAll("*")?.forEach((child) => child.remove());

		for (let i = 0; i < board.length; ++i) {
			const row = document.createElement("div");
			row.classList = "row";

			for (let j = 0; j < board[i].length; ++j) {
				const cell = document.createElement("div");
				cell.classList = "cell";
				cell.textContent = board[i][j];
				row.appendChild(cell);
			}

			this.#boardElement.appendChild(row);
		}

		document
			.querySelectorAll(".keyboard button")
			.forEach((btn) => (btn.classList = ""));
	}

	onBoardUpdated(board) {
		for (let i = 0; i < board.length; ++i) {
			for (let j = 0; j < board[i].length; ++j) {
				let cell = document.querySelector(
					`#board :nth-child(${i + 1}) :nth-child(${j + 1})`
				);
				if (cell.textContent != board[i][j]) {
					cell.textContent = board[i][j];
				}
			}
		}
	}

	onGuessChecked(row, inWordCells, correctCells, keys) {
		let cells = document.querySelectorAll(
			`#board :nth-child(${row + 1}) .cell`
		);

		cells.forEach((cell) => {
			cell.classList.add("checked");
		});

		for (let i = 0; i < inWordCells.length; ++i) {
			let cell = document.querySelector(
				`#board :nth-child(${row + 1}) :nth-child(${inWordCells[i]})`
			);

			cell.classList.add("in-word");
		}

		for (let i = 0; i < correctCells.length; ++i) {
			let cell = document.querySelector(
				`#board :nth-child(${row + 1}) :nth-child(${correctCells[i]})`
			);

			cell.classList.add("correct");
		}

		for (let i = 0; i < keys.length; ++i) {
			let key = document.querySelector(
				`.keyboard button[data-value=${keys[i].key}]`
			);

			key?.classList.add(keys[i].className);
		}
	}

	onGameWin(attempts) {
		this.#isGameOver = true;

		setTimeout(() => {
			document
				.querySelector(`#board > :nth-child(${attempts})`)
				.classList.add("win");
		}, 900);

		setTimeout(() => {
			let ans = confirm("You won! Do you want to play again?");

			if (ans) {
				this.#game.newGame();
			}
		}, 1900);
	}

	onGameOver(word) {
		this.#isGameOver = true;

		let ans = confirm(`Game over! The word was ${word}. Do you want to play again?`);

		if (ans) this.#game.newGame();
	}
}
