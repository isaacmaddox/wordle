import GameController from "./GameController.js";

export const NUM_TRIES = 6;
export const WORD_LENGTH = 5;

const driver = new GameController();

document.addEventListener("keydown", (e) => {
	if (e.key.length == 1 && e.code.startsWith("Key")) {
		return driver.key(e.key);
	}

	switch (e.key) {
		case "Backspace":
			driver.delete();
			break;
		case "Enter":
			driver.guess();
			break;
	}
});

document.querySelectorAll(".keyboard button:not([id])").forEach((key) => {
	key.addEventListener("click", () => {
		driver.key(key.textContent);
	});
});

document.querySelector("#backspace").addEventListener("click", () => {
	driver.delete();
});

document.querySelector("#enter").addEventListener("click", () => {
	driver.guess();
});
