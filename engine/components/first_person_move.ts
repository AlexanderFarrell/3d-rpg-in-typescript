import { quat, vec3 } from "gl-matrix";
import { Component } from "../world/entity";
import type { Updatable } from "../world/world";
import { Engine } from "../main";
import { Location } from "./location";
import { PhysicsBody } from "../physics/physical_obj";
import RAPIER from "@dimforge/rapier3d-compat";


export class FirstPersonMove extends Component implements Updatable {
	// How fast the character can move per second
	public movementSpeed = 4;

	// How many degrees to move per mouse pixel left and right
	public yawSensitivity = 0.5;

	// How many degrees to move per mouse pixel up and down
	// I generally find pitch more sensitive to be nice.
	public pitchSensitivity = 1.0;

	// How quickly should the smoothing complete? 0.5 completes in 2
	// frames. 0.25 in 4. The smaller this number is, the longer 
	// it takes for the yaw or pitch to smooth out. This is necessary
	// on browsers for smoothness, because browsers do integer deltas
	// as of 2026.
	public smoothRotation = 0.4;

	// Initial meters per second of the jump when pressing the
	// space.
	public jumpStrength: number = 8.0;

	// How far above the capsule center the camera sits
	public eyeHeight: number = 1.0;

	// Terminal velocity cap to prevent tunneling through terrain
	public maxFallSpeed: number = -20.0;

	// Max angle (degrees) of a slope the player can walk up
	public maxSlopeClimbAngle: number = 50.0;

	// Angle (degrees) at which steep slopes start sliding the player down
	public minSlopeSlideAngle: number = 50.0;

	private _movement: vec3 = vec3.create();
	private _yaw: number = 180.0;
	private _pitch: number = 0.0;
	private _targetYaw: number = 180.0;
	private _targetPitch: number = 0.0;
	private _location: Location | null = null;
	private _physicsBody: PhysicsBody | null = null;
	private _verticalVelocity: number = 0;
	private _controller: RAPIER.KinematicCharacterController | null = null;

	onStart(): void {
		Engine.world.updatables.add(this);
		this._location = this.entity!.getOrAdd(Location,
			() => new Location()
		);
		this._physicsBody = this.entity!.getOrAdd(PhysicsBody,
			() => new PhysicsBody(
				{kind: 'capsule', halfHeight: 1, radius: 0.3},
				'kinematicPosition'
			)
		);

		this._controller = Engine.physics.world.createCharacterController(0.05);
		this._controller.setSlideEnabled(true);
		this._controller.setMaxSlopeClimbAngle(this.maxSlopeClimbAngle * Math.PI / 180);
		this._controller.setMinSlopeSlideAngle(this.maxSlopeClimbAngle * Math.PI / 180);
		this._controller.setUp({ x: 0, y: 1, z: 0 });
		this._controller.setApplyImpulsesToDynamicBodies(false);

		Engine.input.lockMouse();
	}

	onEnd(): void {
		Engine.world.updatables.delete(this);
		if (this._controller) Engine.physics.world.removeCharacterController(this._controller);
		Engine.input.unlockMouse();
	}

	onUpdate(): void {
		this._movement[0] =
			(Engine.input.isDown('d') ?  1.0 : 0.0) + // Strafe right
			(Engine.input.isDown('a') ? -1.0 : 0.0);  // Strafe left
		this._movement[1] = 0.0;
		this._movement[2] =
			(Engine.input.isDown('w') ? -1.0 : 0.0) + // Move forward
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

		const pos = this._location!.position;
		const collider = Engine.physics.getColliderForBody(this._physicsBody!.rapierHandle!)!;
		const ownHandle = collider.handle;

		// Do a first pass with just vertical movement so the controller
		// can tell us if we're grounded this frame.
		const verticalProbe = { x: 0, y: this._verticalVelocity * Engine.time.Delta - 0.01, z: 0 };
		this._controller!.computeColliderMovement(collider, verticalProbe, undefined, undefined, (c) => c.handle !== ownHandle);
		const grounded = this._controller!.computedGrounded();

		if (grounded) {
			this._verticalVelocity = 0;
			if (Engine.input.isDown(' ') && this.hasHeadroomToJump()) {
				this._verticalVelocity = this.jumpStrength;
			}
		} else {
			this._verticalVelocity += Engine.physics.gravity[1] * Engine.time.Delta;
			this._verticalVelocity = Math.max(this._verticalVelocity, this.maxFallSpeed);
		}

		const desiredMovement = {
			x: this._movement[0],
			y: this._verticalVelocity * Engine.time.Delta,
			z: this._movement[2],
		};
		this._controller!.computeColliderMovement(collider, desiredMovement, undefined, undefined, (c) => c.handle !== ownHandle);

		const corrected = this._controller!.computedMovement();
		this._physicsBody!.setNextKinematicTranslation([
			pos[0] + corrected.x,
			pos[1] + corrected.y,
			pos[2] + corrected.z,
		]);

		// Set the position of the camera, offset upward to eye level
		vec3.set(Engine.visual.camera.location.position,
			this._location!.position[0],
			this._location!.position[1] + this.eyeHeight,
			this._location!.position[2]
		);

		quat.fromEuler(this._location!.rotation, this._pitch, this._yaw, 0.0);
		quat.fromEuler(Engine.visual.camera.location.rotation, this._pitch, this._yaw, 0.0);
	}

	private hasHeadroomToJump(): boolean {
		const pos = { x: this._location!.X, y: this._location!.Y, z: this._location!.Z };
		const ownCollider = Engine.physics.getColliderForBody(this._physicsBody!.rapierHandle!);
		const filter = (c: RAPIER.Collider) => c.handle !== ownCollider?.handle;

		const upRay = new RAPIER.Ray(pos, { x: 0, y: 1, z: 0 });
		// Need at least capsule halfHeight(1) + radius(0.3) + a little clearance
		return Engine.physics.world.castRay(upRay, 1.5, true, undefined, undefined, undefined, undefined, filter) === null;
	}
}