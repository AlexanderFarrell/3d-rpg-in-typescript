import { quat, vec3 } from "gl-matrix";
import { Component } from "../world/entity";
import type { Updatable } from "../world/world";
import { Engine } from "../main";
import { Location } from "./location";


export class FirstPersonMove extends Component implements Updatable {
	public movementSpeed = 4;
	private _movement: vec3 = vec3.create();
	public yawSensitivity = 0.5;
	public pitchSensitivity = 1.0;
	public smoothRotation = 0.4;
	private _yaw: number = 180.0;
	private _pitch: number = 0.0;
	private _targetYaw: number = 180.0;
	private _targetPitch: number = 0.0;
	private _location: Location | null = null;

	onStart(): void {
		Engine.world.updatables.add(this);
		if (!this.entity!.has(Location)) {
			this.entity!.add(new Location());
		}
		this._location = this.entity!.get(Location)!;
		Engine.input.lockMouse();
	}

	onEnd(): void {
		Engine.world.updatables.delete(this);
		Engine.input.unlockMouse();
	}

	onUpdate(): void {
		this._movement[0] =
			(Engine.input.isDown('d') ?  1.0 : 0.0) + // Strafe right
			(Engine.input.isDown('a') ? -1.0 : 0.0);  // Strafe left
		this._movement[1] = 0.0;
		this._movement[2] =
			(Engine.input.isDown('w') ? -1.0 : 0.0) + // Move Forward
			(Engine.input.isDown('s') ?  1.0 : 0.0);  // Move Backward

		this._targetYaw -= Engine.input.mouseDeltaX * this.yawSensitivity;
		this._targetPitch -= Engine.input.mouseDeltaY * this.pitchSensitivity;

		const maxPitch = 89.0;
		this._targetPitch = Math.max(
			-maxPitch,
			Math.min(maxPitch, this._targetPitch)
		);


		this._yaw += (this._targetYaw - this._yaw) * this.smoothRotation;
		this._pitch += (this._targetPitch - this._pitch) * this.smoothRotation;

		const euler = quat.create();
		quat.fromEuler(euler, 0.0, this._yaw, 0.0);
		vec3.transformQuat(
			this._movement,
			this._movement,
			euler
		);
		vec3.scale(this._movement, this._movement, this.movementSpeed * Engine.time.Delta);
		vec3.add(
			this._location!.position,
			this._location!.position,
			this._movement
		);

		vec3.set(Engine.visual.camera.location.position, 
			this._location!.position[0],
			this._location!.position[1],
			this._location!.position[2]
		);

		quat.fromEuler(this._location!.rotation, this._pitch, this._yaw, 0.0);
		quat.fromEuler(Engine.visual.camera.location.rotation, this._pitch, this._yaw, 0.0);
	}
}