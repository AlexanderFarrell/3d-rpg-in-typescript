import { UserInput } from "./input/input";
import { Visual } from "./visual/visual";
import { World } from "./world/world";

// Contains a game engine with visuals, a world
// manager and input
export class Engine {
	public static visual: Visual;
	public static world: World;
	public static input: UserInput;

	// Called to start the game engine, taking a
	// function once set up.
	public static start(onSetup: () => void) {
		Engine.visual = new Visual();
		Engine.world = new World();
		Engine.input = new UserInput();
		onSetup();
		Engine.loop();
	}

	// The main game loop
	private static loop() {
		Engine.update();
		Engine.draw();
		// This is called at the monitor refresh rate, unless the game
		// cannot complete frames faster than the monitor refresh rate.
		requestAnimationFrame(() => {
			// We just call the loop function again to repeat!
			Engine.loop();
		});
	}

	// Updates the logic and movement in the game.
	private static update() {
		Engine.world.update();
	}

	// Draws a frame
	private static draw() {
		Engine.visual.draw();
	}
}
