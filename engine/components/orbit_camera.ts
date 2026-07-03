import { quat, vec3 } from "gl-matrix";
import { Component } from "../world/entity";
import type { Updatable } from "../world/world";
import { Engine } from "../main";




export class OrbitCamera extends Component implements Updatable {
	public distance: number = 20.0;
	public lift: number = 4.0;
	public speed: number = 4.0;
	public rotation: number = 0;
	public focalPoint: vec3;

	private _relativePosition: vec3 = vec3.create();
	private _rot: quat = quat.create();

	public constructor(focalPoint: vec3) {
		super();
		this.focalPoint = focalPoint;
	}

	onStart(): void {
		Engine.world.updatables.add(this);
	}

	onEnd(): void {
		Engine.world.updatables.delete(this);
	}

	onUpdate(): void {
		this.positionCamera();
		this.rotation += this.speed * Engine.time.Delta;
	}	

	private positionCamera() {
		// First calculate distance
		this._relativePosition[0] = 0;
		this._relativePosition[1] = this.lift;
		this._relativePosition[2] = this.distance;

		// Next, calculate rotation
		quat.fromEuler(this._rot, 0, this.rotation, 0);

		// Apply this rotation to the relative
		vec3.transformQuat(
			this._relativePosition,
			this._relativePosition,
			this._rot
		);

		// Add to camera
		vec3.add(
			Engine.visual.camera.location.position,
			this._relativePosition,
			this.focalPoint
		);

		quat.fromEuler(
			Engine.visual.camera.location.rotation,
			-Math.atan2(this.lift, this.distance) * (180 / Math.PI),
			this.rotation,
			0
		);
	}
}

export class ControlledOrbitCamera extends OrbitCamera {
	public movementSpeed = 20/60.0;
	private _movement: vec3 = vec3.create();

	public constructor(focalPoint: vec3) {
		super(focalPoint);
		this.speed = 0; // We just disable the speed.
	}

	public onUpdate(): void {
		this._movement[0] =
			(Engine.input.isDown('d') ?  1.0 : 0.0) + // Strafe right
			(Engine.input.isDown('a') ? -1.0 : 0.0);  // Strafe left
		this._movement[1] =
			(Engine.input.isDown('g') ?  1.0 : 0.0) + // Move Up
			(Engine.input.isDown('h') ? -1.0 : 0.0);  // Move Down
		this._movement[2] =
			(Engine.input.isDown('w') ? -1.0 : 0.0) + // Move Forward
			(Engine.input.isDown('s') ?  1.0 : 0.0);  // Move Backward

		// Multiply by the speed we should go
		vec3.scale(this._movement, this._movement, this.movementSpeed);	
		
		const euler = quat.create();
		quat.fromEuler(euler, 0.0, this.rotation, 0.0);
		vec3.transformQuat(
			this._movement,
			this._movement,
			euler
		);
		
		// Have the movement go in the direction of the camera
		vec3.transformQuat(
			this._movement,
			this._movement,
			euler
		);
		vec3.add(
			this.focalPoint,
			this.focalPoint,
			this._movement
		);

		super.onUpdate();
	}
}