import { Visual } from "./visual/visual";

export class Engine {
	public static Visual: Visual;

	public static start() {
		Engine.Visual = new Visual();
		this.loop();
	}

	private static loop() {
		this.update();
		this.draw();
		requestAnimationFrame(() => {
			Engine.loop();
		});
	}

	private static update() {

	}

	private static draw() {
		Engine.Visual.Draw();
		console.log("draw")
	}
}