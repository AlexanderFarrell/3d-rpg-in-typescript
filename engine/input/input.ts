// TODO: Make for the canvas, not document.body.
export class UserInput {
	public keysDown: Set<string> = new Set<string>();

	public mouseDeltaX = 0;
	public mouseDeltaY = 0;

	public isPointerLocked = false;
	private allowedToLock = false;

	private _canvas: HTMLCanvasElement;

	constructor() {
		this._canvas = document.querySelector("canvas")!;
		document.body.addEventListener('keydown', (event) => {
			this.keysDown.add(event.key);
		})

		document.body.addEventListener('keyup', (event) => {
			this.keysDown.delete(event.key);
		})

		this._canvas.addEventListener('click', (event) => {
			if (this.isPointerLocked || !this.allowedToLock) {
				this._canvas.requestPointerLock();
			}
		})

		document.addEventListener('pointerlockchange', () => {
			this.allowedToLock = 
				document.pointerLockElement === this._canvas;
		})

		document.body.addEventListener('mousemove', (event) => {
			if (this.allowedToLock) {
				this.mouseDeltaX = event.movementX;
				this.mouseDeltaY = event.movementY;
				console.log(`Mouse Delta X: ${this.mouseDeltaX}, ${this.mouseDeltaY}`)
			} else {
				this.mouseDeltaX = 0;
				this.mouseDeltaY = 0;
			}
		})
	}

	isDown(key: string) {
		return this.keysDown.has(key);
	}

	lockMouse() {
		this.isPointerLocked = true;
	}

	unlockMouse() {
		this.isPointerLocked = false;

		if (this.allowedToLock) {
			document.exitPointerLock()
		}
	}
}
