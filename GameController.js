import Game from "./Game.js";
import ToastManager from "./ToastManager.js";

export default class GameController {
	#game = new Game();
	#toastManager = new ToastManager();
	#boardElement;
	#isGameOver = false;

	constructor() {
		this.#boardElement = document.getElementById("board");

		this.#game.addBoardListener(this);
		this.#game.newGame();
	}

	key(key) {
		if (!this.#isGameOver) this.#game.key(key);
	}

	delete() {
		if (!this.#isGameOver) this.#game.delete();
	}

	clearGuess() {
		if (!this.#isGameOver) this.#game.clearGuess();
	}

	guess() {
		if (this.#isGameOver) {
			return false;
		}

		let [isValid, message] = this.#game.checkValidWord();

		if (!isValid) {
			this.#toastManager.toast(message);
			return false;
		}

		this.#game.guess();

		return true;
	}

	onBoardCreated(board) {
		this.#boardElement
			.querySelectorAll("*")
			?.forEach((child) => child.remove());

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

		this.#isGameOver = false;
	}

	onBoardUpdated(board) {
		for (let i = 0; i < board.length; ++i) {
			let cells = document.querySelectorAll(`#board :nth-child(${i + 1}) *`);

			for (let j = 0; j < board[i].length; ++j) {
				if (cells[j].textContent != board[i][j]) {
					cells[j].textContent = board[i][j];
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

			cell.classList.add("checked", "in-word");
		}

		for (let i = 0; i < correctCells.length; ++i) {
			let cell = document.querySelector(
				`#board :nth-child(${row + 1}) :nth-child(${correctCells[i]})`
			);

			cell.classList.add("checked", "correct");
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

		this.confirm(
			"Congratulations!",
			`You solved the puzzle in ${attempts} attempts. Play again?`,
			() => this.#game.newGame(),
			true,
			1900
		);
	}

	onGameOver(word) {
		this.#isGameOver = true;

		this.confirm(
			"Game Over!",
			`The word was "${word}." Do you want to play again?`,
			() => this.#game.newGame(),
			true,
			900
		);
	}

	confirm(title, message, accept, reject, delay = 0) {
		let dialogElement = document.createElement("dialog");
		let headerElement = document.createElement("header");
		let closeButton = document.createElement("button");
		let titleElement = document.createElement("h2");
		let messageElement = document.createElement("p");
		let optionsElement = document.createElement("form");
		let yesButton = document.createElement("button");
		let noButton = document.createElement("button");

		titleElement.textContent = title;

		closeButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M6.16634 16.773C5.87345 17.0659 5.87345 17.5408 6.16634 17.8336C6.45923 18.1265 6.93411 18.1265 7.227 17.8336L12 13.0607L16.7729 17.8337C17.0658 18.1265 17.5407 18.1265 17.8336 17.8337C18.1265 17.5408 18.1265 17.0659 17.8336 16.773L13.0606 12L17.8336 7.22705C18.1265 6.93415 18.1265 6.45928 17.8336 6.16639C17.5407 5.87349 17.0658 5.87349 16.7729 6.16639L12 10.9394L7.22699 6.16639C6.93409 5.8735 6.45922 5.8735 6.16633 6.16639C5.87343 6.45928 5.87343 6.93416 6.16633 7.22705L10.9393 12L6.16634 16.773Z" fill="#fff"/>
			</svg>`;

		closeButton.onclick = () => {
			dialogElement.close();
		};

		messageElement.textContent = message;

		optionsElement.method = "dialog";

		yesButton.textContent = reject ? "Yes" : "Okay";
		yesButton.type = "submit";
		yesButton.onclick = accept;

		noButton.textContent = reject ? "No" : "Close";
		noButton.type = "submit";

		headerElement.append(titleElement, closeButton);

		optionsElement.append(yesButton, noButton);

		dialogElement.append(headerElement, messageElement, optionsElement);

		document.body.prepend(dialogElement);

		setTimeout(() => {
			dialogElement.showModal();
			dialogElement.onclose = () => {
				setTimeout(() => dialogElement.remove(), 200);
			};
			yesButton.focus();
		}, delay);
	}
}
