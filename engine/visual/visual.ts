import { PerspectiveCamera, type Camera } from "./camera";
import { Color } from "./color";
import { setGL } from "./gl";

export interface Drawable {
	Setup(): void;
	Breakdown(): void;
	Draw(): void;
}

export class Visual {
	public Canvas: HTMLCanvasElement;
	public ClearColor: Color;
	public Camera: Camera;

	private _gl: WebGL2RenderingContext;
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

		this._gl = gl;
		setGL(gl);

		this.Camera = new PerspectiveCamera(
			this._gl.canvas.width / this._gl.canvas.height
		);
		this.Register(this.Camera);
		this.OnResize();
		window.addEventListener('resize', () => {
			this.OnResize();
		})
	}

	private OnResize() {
		this.Canvas.setAttribute("width", String(window.innerWidth));
		this.Canvas.setAttribute("height", String(window.innerHeight));
		this._gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		(this.Camera as PerspectiveCamera).AspectRatio = window.innerWidth / window.innerHeight;
		this.Camera.RefreshProjection();
	}

	public Draw() {
		this._gl.clearColor(
			this.ClearColor.Red,
			this.ClearColor.Green,
			this.ClearColor.Blue,
			this.ClearColor.Alpha
		);
		this._gl.clearDepth(1.0);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.depthFunc(this._gl.LEQUAL);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

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
