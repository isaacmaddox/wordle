export default class ToastManager {
	#toasts = [];
	#container;
	#TOAST_DURATION = 2000;

	constructor() {
		this.#container = document.getElementById("toast-container");
	}

	toast(message) {
		let newToast = new Toast(message);
		this.#toasts = [newToast, ...this.#toasts];
		this.#container?.appendChild(newToast.getElement());
		this.updateToastTops();

		setTimeout(() => {
			newToast.remove();
			this.#toasts.splice(this.#toasts.indexOf(newToast), 1);
		}, this.#TOAST_DURATION);
	}

	updateToastTops() {
		let top = 16;
		let tmpToasts = [...this.#toasts];

		for (let i = 0; i < tmpToasts.length; ++i) {
			tmpToasts[i].setTop(top);
			top += tmpToasts[i].getHeight() + 8;
		}
	}
}

class Toast {
	#element;
	#height;

	constructor(message) {
		this.#element = document.createElement("div");
		this.#element.classList = "toast";
		this.#element.textContent = message;
	}

	setTop(top) {
		setTimeout(() => {
			this.#element.style.setProperty("--_top", `${top}px`);
		}, 1);
	}

	getElement() {
		return this.#element;
	}

	getHeight() {
		if (!this.#height) {
			this.#height = this.#element.getBoundingClientRect().height;
		}

		return this.#height;
	}

	remove() {
		this.#element.classList.add("hide");

		setTimeout(() => {
			this.#element.remove();
		}, 200);
	}
}
