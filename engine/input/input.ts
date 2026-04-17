// TODO: Make for the canvas, not document.body.
export class UserInput {
	public keysDown: Set<string> = new Set<string>();

	constructor() {
		document.body.addEventListener('keydown', (event) => {
			this.keysDown.add(event.key);
		})

		document.body.addEventListener('keyup', (event) => {
			this.keysDown.delete(event.key);
		})
	}

	isDown(key: string) {
		return this.keysDown.has(key);
	}
}
