import { Visual } from "./visual/visual";
import { World } from "./world/world";

export class Engine {
	public static Visual: Visual;
	public static World: World;

	public static start(on_setup: () => void) {
		Engine.Visual = new Visual();
		Engine.World = new World();
		on_setup();
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
		Engine.World.Update();
	}

	private static draw() {
		Engine.Visual.Draw();
		console.log("draw")
	}
}