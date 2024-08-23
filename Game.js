import { NUM_TRIES, WORD_LENGTH } from "./scripts.js";
import { WORDS } from "./words.js";

export default class Game {
	#word;
	#currentGuess = "";
	#listener = null;
	#currentIndex;
	#board;

	newGame() {
		this.#board = [].fill([null, null, null, null, null]);
		this.#word = WORDS[Math.floor(Math.random() * WORDS.length)];
		this.#currentIndex = 0;

		for (let i = 0; i < NUM_TRIES; ++i) {
			this.#board.push(new Array(WORD_LENGTH).fill(""));
		}

		this.#listener?.onBoardCreated(this.#board);
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

	checkValidWord() {
		if (this.#currentGuess.length < WORD_LENGTH) {
			return "Not long enough!";
		}

		if (!WORDS.includes(this.#currentGuess)) {
			return "Not in words list!";
		}

		return false;
	}

	guess() {
		let tmpWord = this.#word.split('');
		let existingCells = [];
		let correctCells = [];
		let keys = tmpWord.map(key => {
			return {
				key: key,
				className: 'checked'
			}
		});

		for (let i = 0; i < this.#currentGuess.length; ++i) {
			let indexOfLetter = tmpWord.indexOf(this.#currentGuess[i]);

			if (indexOfLetter > -1) {
				tmpWord[indexOfLetter] = "#";
				existingCells.push(i);
			}

			if (this.#word[i] === this.#currentGuess[i]) {
				correctCells.push(i);
			}
		}

		for (let index of existingCells) {
			keys.push({
				key: this.#currentGuess[index],
				className: "in-word"
			})
		}

		for (let index of correctCells) {
			if (!tmpWord.includes(this.#currentGuess[index])) {
				keys.push({
					key: this.#currentGuess[index],
					className: "correct"
				})
			}
		}

		this.#listener?.onGuessChecked(
			this.#currentIndex,
			existingCells.map(v => v + 1),
			correctCells.map(v => v + 1),
			keys
		);

		++this.#currentIndex;

		if (this.#currentGuess === this.#word) {
			this.#listener?.onGameWin(this.#currentIndex);
		}

		if (this.#currentIndex === 6) {
			this.#listener?.onGameOver(this.#word);
		}

		this.#currentGuess = "";
	}

	addBoardListener(listener) {
		this.#listener = listener;
	}
}
