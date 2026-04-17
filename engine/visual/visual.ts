import { PerspectiveCamera, type Camera } from "./camera";
import { Color } from "./color";
import { getGL, setGL } from "./gl";

export interface Drawable {
	Setup(): void;
	Breakdown(): void;
	Draw(): void;
}

export class Visual {
	public Canvas: HTMLCanvasElement;
	public ClearColor: Color;
	public Camera: Camera;

	private _drawables: Set<Drawable> = new Set();

	public constructor() {
		this.Canvas = document.querySelector("canvas")!;
		this.ClearColor = new Color(0.2, 0.6, 0.9);

		let gl = this.Canvas.getContext("webgl2");
		if (gl == null) {
			let message = "Error: WebGL2 failed to start. It may not be supported on this device."
			this.Canvas.innerHTML = message;
			throw new Error(message);
		}

		setGL(gl);

		this.Camera = new PerspectiveCamera(
			gl.canvas.width / gl.canvas.height
		);
		this.Register(this.Camera);
		this.OnResize();
		window.addEventListener('resize', () => {
			this.OnResize();
		})
	}

	private OnResize() {
		let gl = getGL();
		this.Canvas.setAttribute("width", String(window.innerWidth));
		this.Canvas.setAttribute("height", String(window.innerHeight));
		gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		(this.Camera as PerspectiveCamera).AspectRatio = window.innerWidth / window.innerHeight;
		this.Camera.RefreshProjection();
	}

	public Draw() {
		let gl = getGL();
		gl.clearColor(
			this.ClearColor.Red,
			this.ClearColor.Green,
			this.ClearColor.Blue,
			this.ClearColor.Alpha
		);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this._drawables.forEach(drawable => {
			drawable.Draw();
		})
	}

	public Register(drawable: Drawable) {
		this._drawables.add(drawable);
		drawable.Setup();
	}

	public Unregister(drawable: Drawable) {
		drawable.Breakdown();
		this._drawables.delete(drawable);
	}
}
