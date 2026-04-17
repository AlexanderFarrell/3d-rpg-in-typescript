import { vec3 } from "gl-matrix";
import { Engine } from "../main";
import { Component } from "../world/entity";
import type { Updatable } from "../world/world";


export class FlyCamera extends Component implements Updatable {
	public movementSpeed = 4/60.0;
	private _movement: vec3 = vec3.create();

	onStart(): void {
		Engine.world.updatables.add(this);
	}

	onEnd(): void {
		Engine.world.updatables.delete(this);
	}

	onUpdate(): void {
		this._movement[0] =
			(Engine.input.isDown('d') ? -1.0 : 0.0) + // Strafe right
			(Engine.input.isDown('a') ?  1.0 : 0.0);  // Strafe left
		this._movement[1] =
			(Engine.input.isDown('g') ?  1.0 : 0.0) + // Move Up
			(Engine.input.isDown('h') ? -1.0 : 0.0);  // Move Down
		this._movement[2] =
			(Engine.input.isDown('w') ?  1.0 : 0.0) + // Move Forward
			(Engine.input.isDown('s') ? -1.0 : 0.0);  // Move Backward

		// Multiply by the speed we should go
		vec3.scale(this._movement, this._movement, this.movementSpeed);

		// Have the movement go in the direction of the camera
		vec3.transformQuat(
			this._movement,
			this._movement,
			Engine.visual.camera.location.rotation
		);
		vec3.add(
			Engine.visual.camera.location.position,
			Engine.visual.camera.location.position,
			this._movement
		);
	}
}
