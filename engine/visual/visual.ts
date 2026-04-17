import { PerspectiveCamera, type Camera } from "./camera";
import { Color } from "./color";

export interface Drawable {
	Setup(gl: WebGL2RenderingContext): void;
	Breakdown(gl: WebGL2RenderingContext): void;
	Draw(gl: WebGL2RenderingContext): void;
}

export class Visual {
	public Canvas: HTMLCanvasElement;
	private GL: WebGL2RenderingContext;
	public ClearColor: Color;
	public Camera: Camera;

	private _drawables: Set<Drawable> = new Set();

	public constructor() {
		this.Canvas = document.querySelector("canvas")!;
		this.ClearColor = new Color(0.2, 0.6, 0.9);
		
		// Try to start WebGL
		let gl = this.Canvas.getContext("webgl2");
		if (gl == null) {
			// If this happens, webgl2 is not supported
			// We should notify the user and stop
			let message = "Error: WebGL2 failed to start. It may not be supported on this device."
			this.Canvas.innerHTML = message;
			throw new Error(message);
		}

		this.GL = gl!;

		this.Camera = new PerspectiveCamera(
			this.GL.canvas.width / this.GL.canvas.height
		);
	}

	public Draw() {
		// What color is the default (what we start with) each frame
		this.GL.clearColor(
			this.ClearColor.Red,
			this.ClearColor.Green,
			this.ClearColor.Blue,
			this.ClearColor.Alpha
		);

		// These are how we determine what objects are behind which

		// Distance of the "camera depth"
		this.GL.clearDepth(1.0); 

		// Actually enable testing
		this.GL.enable(this.GL.DEPTH_TEST); 
		
		// How do we know what is behind what?
		this.GL.depthFunc(this.GL.LEQUAL);


		// This is where we actually clear the frame
		this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);

		this._drawables.forEach(drawable => {
			drawable.Draw(this.GL);
		})
	}

	public Register(drawable: Drawable) {
		this._drawables.add(drawable);
		drawable.Setup(this.GL);
	}

	public Unregister(drawable: Drawable) {
		drawable.Breakdown(this.GL);
		this._drawables.delete(drawable);
	}
}