import { UserInput } from "./input/input";
import { Visual } from "./visual/visual";
import { World } from "./world/world";

export class Engine {
	public static visual: Visual;
	public static world: World;
	public static input: UserInput;

	public static start(onSetup: () => void) {
		Engine.visual = new Visual();
		Engine.world = new World();
		Engine.input = new UserInput();
		onSetup();
		Engine.loop();
	}

	private static loop() {
		Engine.update();
		Engine.draw();
		requestAnimationFrame(() => {
			Engine.loop();
		});
	}

	private static update() {
		Engine.world.update();
	}

	private static draw() {
		Engine.visual.draw();
	}
}
