import { PerspectiveCamera, type Camera } from "./camera";
import { Color } from "./color";
import { getGL, setGL } from "./gl";

export interface Drawable {
	setup(): void;
	breakdown(): void;
	draw(): void;
}

export class Visual {
	public canvas: HTMLCanvasElement;
	public clearColor: Color;
	public camera: Camera;

	private _drawables: Set<Drawable> = new Set();

	public constructor() {
		this.canvas = document.querySelector("canvas")!;
		this.clearColor = new Color(0.2, 0.6, 0.9);

		let gl = this.canvas.getContext("webgl2");
		if (gl == null) {
			let message = "Error: WebGL2 failed to start. It may not be supported on this device."
			this.canvas.innerHTML = message;
			throw new Error(message);
		}

		setGL(gl);

		this.camera = new PerspectiveCamera(
			gl.canvas.width / gl.canvas.height
		);
		this.register(this.camera);
		this.onResize();
		window.addEventListener('resize', () => {
			this.onResize();
		})
	}

	private onResize() {
		let gl = getGL();
		this.canvas.setAttribute("width", String(window.innerWidth));
		this.canvas.setAttribute("height", String(window.innerHeight));
		gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		(this.camera as PerspectiveCamera).aspectRatio = window.innerWidth / window.innerHeight;
		this.camera.refreshProjection();
	}

	public draw() {
		let gl = getGL();
		gl.clearColor(
			this.clearColor.red,
			this.clearColor.green,
			this.clearColor.blue,
			this.clearColor.alpha
		);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this._drawables.forEach(drawable => {
			drawable.draw();
		})
	}

	public register(drawable: Drawable) {
		this._drawables.add(drawable);
		drawable.setup();
	}

	public unregister(drawable: Drawable) {
		drawable.breakdown();
		this._drawables.delete(drawable);
	}
}
