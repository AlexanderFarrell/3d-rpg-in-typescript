import RAPIER from "@dimforge/rapier3d-compat";
import type { vec3 } from "gl-matrix";
import type { Time } from "../time/time";

export type PhysicsType = 'dynamic' | 'static' | 'kinematicPosition';

export interface IPhysical {
	initPhysics(world: RAPIER.World): void,
	deinitPhysics(world: RAPIER.World): void,
	syncTransform(world: RAPIER.World): void,
	get isStatic(): boolean,
	get rapierHandle(): RAPIER.RigidBodyHandle | null,
}

export class PhysicsWorld {
	private _world: RAPIER.World;
	private _bodies: Map<number, IPhysical> = new Map();
	private _dynamicBodies: Map<number, IPhysical> = new Map();
	public gravity: vec3;

	public static async init(): Promise<void> {
		await RAPIER.init();
	}

	// Get gravity, default to earth's gravity if not specified.
	public constructor(gravity: vec3 = [0, -9.81, 0]) {
		this._world = new RAPIER.World({
			x: gravity[0],
			y: gravity[1],
			z: gravity[2]
		});
		this.gravity = gravity;
	}

	public update(time: Time) {
		this._world.timestep = time.Delta;
		this._world.step();
		for (const [handle, body] of this._dynamicBodies) {
			body.syncTransform(this._world);
		}
	}

	public register(obj: IPhysical) {
		obj.initPhysics(this._world);
		const handle = obj.rapierHandle;
		if (handle == null) return;
		this._bodies.set(handle, obj);
		if (!obj.isStatic) {
			this._dynamicBodies.set(handle, obj);
		}
	}

	public unregister(obj: IPhysical) {
		const handle = obj.rapierHandle;
		if (handle !== null) {
			this._bodies.delete(handle)
			if (!obj.isStatic) {
				this._dynamicBodies.delete(handle);
			};
		}
		obj.deinitPhysics(this._world);
	}

	public getRigidBody(handle: RAPIER.RigidBodyHandle): RAPIER.RigidBody | undefined {
		return this._world.getRigidBody(handle);
	}

	public getColliderForBody(handle: RAPIER.RigidBodyHandle): RAPIER.Collider | undefined {
		const rb = this.world.getRigidBody(handle);
		if (!rb || rb.numColliders() === 0) return undefined;
		return rb.collider(0);
	}

	public get world(): RAPIER.World {
		return this._world;
	}
}
