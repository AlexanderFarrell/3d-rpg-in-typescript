
// TODO: Make for the canvas, not document.body.
export class UserInput {
	public KeysDown: Set<string> = new Set<string>();

	constructor() {
		document.body.addEventListener('keydown', (event) => {
			this.KeysDown.add(event.key);
		})

		document.body.addEventListener('keyup', (event) => {
			this.KeysDown.delete(event.key);
		})
	}

	IsDown(key: string) {
		return this.KeysDown.has(key);
	}
}