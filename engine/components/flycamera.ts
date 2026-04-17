import { vec3 } from "gl-matrix";
import { Engine } from "../main";
import { Component } from "../world/entity";
import type { Updatable } from "../world/world";


export class FlyCamera extends Component implements Updatable {
	public MovementSpeed = 4/60.0;
	private _movement: vec3 = vec3.create();

	on_start(): void {
		Engine.World.Updatables.add(this);
	}

	on_end(): void {
		Engine.World.Updatables.delete(this);
	}

	OnUpdate(): void {
		this._movement[0] = 
			(Engine.Input.IsDown('d') ?  1.0 : 0.0) + // Strafe left
			(Engine.Input.IsDown('a') ? -1.0 : 0.0);  // Strafe right;
		this._movement[1] = 
			(Engine.Input.IsDown('g') ?  1.0 : 0.0) + // Move Up
			(Engine.Input.IsDown('h') ? -1.0 : 0.0);  // Move Down
		this._movement[2] = 
			(Engine.Input.IsDown('w') ? -1.0 : 0.0) + // Move Forward
			(Engine.Input.IsDown('s') ?  1.0 : 0.0);  // Move Backward

		// Multiply by the speed we should go
		vec3.scale(this._movement, this._movement, this.MovementSpeed);	
		
		// Have the movement go in the direction of the camera
		vec3.transformQuat(
			this._movement, // Destination
			this._movement, // Input
			Engine.Visual.Camera.Location.Rotation // Quat to rotate with
		);
		vec3.add(
			Engine.Visual.Camera.Location.Position, // Destination
			Engine.Visual.Camera.Location.Position, // Input
			this._movement // Add it to this
		);
	}
}