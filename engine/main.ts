import { UserInput } from "./input/input";
import { Time } from "./time/time";
import { Visual } from "./visual/visual";
import { World } from "./world/world";

// Contains a game engine with visuals, a world
// manager and input
export class Engine {
	public static visual: Visual;
	public static world: World;
	public static input: UserInput;
	public static time: Time;

	// Called to start the game engine, taking a
	// function once set up.
	public static start(onSetup: () => void) {
		Engine.visual = new Visual();
		Engine.world = new World();
		Engine.input = new UserInput();
		Engine.time = new Time();
		onSetup();
		Engine.loop();
	}

	// The main game loop
	private static loop(timestamp: number = 0) {
		this.time.onStartUpdate(timestamp);
		Engine.update();
		Engine.draw();
		this.input.endUpdate();
		// This is called at the monitor refresh rate, unless the game
		// cannot complete frames faster than the monitor refresh rate.
		requestAnimationFrame((timestamp: number) => {
			// We just call the loop function again to repeat!
			Engine.loop(timestamp);
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
