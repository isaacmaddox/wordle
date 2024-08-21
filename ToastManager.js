export default class ToastManager {
	toasts = [];
	container;

	constructor() {
		this.container = document.getElementById("toast-container");
	}

	toast(message) {
		let newToast = new Toast(message);
		this.toasts = [newToast, ...this.toasts];
		this.container.appendChild(newToast.getElement());
		this.updateToastTops();

		setTimeout(() => {
			newToast.remove();
			this.toasts.splice(this.toasts.indexOf(newToast), 1);
		}, 2000);
	}

	updateToastTops() {
		let top = 16;
		let tmpToasts = [...this.toasts];

		for (let i = 0; i < tmpToasts.length; ++i) {
			tmpToasts[i].setTop(top);
			top += tmpToasts[i].getHeight() + 8;
		}
	}
}

class Toast {
	element;

	constructor(message, top) {
		this.element = document.createElement("div");
		this.element.classList = "toast";
		this.element.textContent = message;
	}

	setTop(top) {
		setTimeout(() => {
			this.element.style.setProperty("--_top", `${top}px`);
		}, 1);
	}

	getElement() {
		return this.element;
	}

	getHeight() {
		return this.element.getBoundingClientRect().height;
	}

	remove() {
		this.element.remove();
	}
}
