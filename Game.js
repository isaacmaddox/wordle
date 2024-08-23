import { NUM_TRIES, WORD_LENGTH } from "./scripts.js";
import { WORDS } from "./words.js";

export default class Game {
	#word;
	#currentGuess = "";
	#listener = null;
	#currentIndex;
	#board;

	newGame() {
		this.#board = [];
		this.#word = WORDS[Math.floor(Math.random() * WORDS.length)];
		this.#currentIndex = 0;

		for (let i = 0; i < NUM_TRIES; ++i) {
			this.#board.push(new Array(WORD_LENGTH).fill(""));
		}

		this.#listener?.onBoardCreated(this.#board);
		console.log(this.#word);
	}

	key(key) {
		if (this.#currentGuess.length < WORD_LENGTH) {
			this.#board[this.#currentIndex][this.#currentGuess.length] = key;
			this.#currentGuess += key;
		}

		this.#listener?.onBoardUpdated(this.#board);
	}

	delete() {
		this.#board[this.#currentIndex][this.#currentGuess.length - 1] = null;
		this.#currentGuess = this.#currentGuess.slice(
			0,
			this.#currentGuess.length - 1
		);

		this.#listener?.onBoardUpdated(this.#board);
	}

	clearGuess() {
		this.#currentGuess = "";
		this.#board[this.#currentIndex] = new Array(WORD_LENGTH).fill(null);
		this.#listener?.onBoardUpdated(this.#board);
	}

	checkValidWord() {
		if (this.#currentGuess.length < WORD_LENGTH) {
			return [false, "Not long enough!"];
		}

		if (!WORDS.includes(this.#currentGuess)) {
			return [false, "Not in words list!"];
		}

		return [true, null];
	}

	guess() {
		let tmpWord = [...this.#word];
		let existingCells = [];
		let correctCells = [];
		let keys = [...this.#currentGuess].map((value) => {
			return {
				key: value,
				className: "checked",
			};
		});

		for (let i = 0; i < this.#currentGuess.length; ++i) {
			let indexOfLetter = tmpWord.indexOf(this.#currentGuess[i]);

			if (this.#word[i] === this.#currentGuess[i]) {
				correctCells.push(i);
				tmpWord[indexOfLetter] = "#";
				continue;
			}

			if (indexOfLetter > -1) {
				tmpWord[indexOfLetter] = "#";
				existingCells.push(i);
			}
		}

		for (let index of correctCells) {
			if (!tmpWord.includes(this.#currentGuess[index])) {
				keys.push({
					key: this.#currentGuess[index],
					className: "correct",
				});
			} else {
				keys.push({
					key: this.#currentGuess[index],
					className: "in-word",
				});
			}
		}

		for (let index of existingCells) {
			keys.push({
				key: this.#currentGuess[index],
				className: "in-word",
			});
		}

		this.#listener?.onGuessChecked(
			this.#currentIndex,
			existingCells.map((v) => v + 1),
			correctCells.map((v) => v + 1),
			keys
		);

		console.log(keys);

		++this.#currentIndex;

		if (this.#currentGuess === this.#word) {
			this.#listener?.onGameWin(this.#currentIndex);
		}

		if (this.#currentIndex === NUM_TRIES) {
			this.#listener?.onGameOver(this.#word);
		}

		this.#currentGuess = "";
	}

	addBoardListener(listener) {
		this.#listener = listener;
	}
}
