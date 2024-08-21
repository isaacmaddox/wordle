import { NUM_TRIES, WORD_LENGTH } from "./scripts.js";
import { WORDS } from "./words.js";

export default class Game {
	word;
	currentGuess = "";
	listener;
	currentIndex;
	board;

	newGame() {
		this.board = [].fill([null, null, null, null, null]);
		this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
		this.currentIndex = 0;

		for (let i = 0; i < NUM_TRIES; ++i) {
			this.board.push(new Array(WORD_LENGTH).fill(""));
		}

		this.listener.onBoardCreated(this.board);
		console.log(this.word);
	}

	key(key) {
		if (this.currentGuess.length < 5) {
			this.board[this.currentIndex][this.currentGuess.length] = key;
			this.currentGuess += key;
		}

		this.listener.onBoardUpdated(this.board);
	}

	delete() {
		this.board[this.currentIndex][this.currentGuess.length - 1] = null;
		this.currentGuess = this.currentGuess.slice(
			0,
			this.currentGuess.length - 1
		);

		this.listener.onBoardUpdated(this.board);
	}

	checkValidWord() {
		if (this.currentGuess.length < 5) {
			return "Not long enough!";
		}

		if (!WORDS.includes(this.currentGuess)) {
			return "Not in words list!";
		}

		return false;
	}

	guess() {
		// Create Map of letters
		const letterMap = new Map();

		for (let i = 0; i < this.word.length; ++i) {
			if (letterMap.has(this.word[i])) {
				letterMap.set(this.word[i], letterMap.get(this.word[i]) + 1);
			} else {
				letterMap.set(this.word[i], 1);
			}
		}

		// Keep track of letters that exist in the word
		let existingCells = [];

		for (let i = 0; i < this.currentGuess.length; ++i) {
			let letter = this.currentGuess[i];
			if (letterMap.has(letter)) {
				existingCells.push(i);

				if (letterMap.get(letter) == 1) {
					letterMap.delete(letter);
				} else {
					letterMap.set(letter, letterMap.get(letter) - 1);
				}
			}
		}

		// Keep track of correct letters (in the right place)
		let correctCells = [];

		for (let i = 0; i < this.word.length; ++i) {
			if (this.currentGuess[i] === this.word[i]) {
				correctCells.push(i);
			}
		}

		// Keep track of keys
		let keys = [];

		for (let i = 0; i < this.currentGuess.length; ++i) {
			keys.push({
				key: this.currentGuess[i],
				className: "checked",
			});
		}

		for (let i = 0; i < existingCells.length; ++i) {
			keys.push({
				key: this.currentGuess[existingCells[i]],
				className: "in-word",
			});
		}

		for (let i = 0; i < correctCells.length; ++i) {
			if (!letterMap.has(this.currentGuess[correctCells[i]])) {
				keys.push({
					key: this.currentGuess[correctCells[i]],
					className: "correct",
				});
			}
		}

		this.listener.onGuessChecked(
			this.currentIndex,
			existingCells.map((v) => v + 1),
			correctCells.map((v) => v + 1),
			keys
		);

		++this.currentIndex;

		if (this.currentGuess === this.word) {
			this.listener.onGameWin(this.currentIndex);
		}

		this.currentGuess = "";
	}

	addBoardListener(listener) {
		this.listener = listener;
	}
}
