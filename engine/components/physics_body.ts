import Rapier from '@dimforge/rapier3d-compat'
import { Component } from '../world/entity'
import { Location } from './location'
import { Engine } from '../main'
import type { IPhysical, PhysicsType } from '../physics/physics_world'
import type { vec3 } from 'gl-matrix'


export class PhysicsBody extends Component implements IPhysical {
	public readonly shape: PhysicsShape;
	public readonly bodyType: PhysicsType;
	private _rapierHandle: Rapier.RigidBodyHandle | null = null;
	private _location: Location | null = null;

	public constructor(shape: PhysicsShape, bodyType: PhysicsType = 'dynamic') {
		super();
		this.shape = shape;
		this.bodyType = bodyType;
	}

	onStart(): void {
		this._location = this.entity!.getOrAdd(Location, 
			() => new Location()
		);
		Engine.physics.register(this);
	}

	onEnd(): void {
		Engine.physics.unregister(this);		
	}

	public initPhysics(world: Rapier.World) {
		let rigidbodyDesc: Rapier.RigidBodyDesc;
		switch (this.bodyType) {
			case 'dynamic':
				rigidbodyDesc = Rapier.RigidBodyDesc.dynamic();
				break;
			case 'static':
				rigidbodyDesc = Rapier.RigidBodyDesc.fixed();
				break;
			case 'kinematicPosition':
				rigidbodyDesc = Rapier.RigidBodyDesc.kinematicPositionBased()
				break;
			default:
				throw new Error("Unknown body type: " + this.bodyType)
		}
		rigidbodyDesc.setTranslation(
			this._location!.X,
			this._location!.Y,
			this._location!.Z
		);
		const rigidbody = world.createRigidBody(rigidbodyDesc);
		// TODO: Do we need rotation?
		world.createCollider(shapeToColliderDesc(this.shape), rigidbody);
		this._rapierHandle = rigidbody.handle;
	}

	public deinitPhysics(world: Rapier.World) {
		if (this._rapierHandle == null) return;
		const rigidbody = world.getRigidBody(this._rapierHandle);
		if (rigidbody) {
			world.removeRigidBody(rigidbody);
		}
		this._rapierHandle = null;
	}

	public syncTransform(world: Rapier.World) {
		const rigidbody = world.getRigidBody(this._rapierHandle!);
		if (!rigidbody) return;
		const translation = rigidbody.translation();
		const rotation = rigidbody.rotation();
		this._location!.position[0] = translation.x;
		this._location!.position[1] = translation.y;
		this._location!.position[2] = translation.z;
		this._location!.rotation[0] = rotation.x;
		this._location!.rotation[1] = rotation.y;
		this._location!.rotation[2] = rotation.z;
		this._location!.rotation[3] = rotation.w;
		this._location!.refresh();
	}

	public setNextKinematicTranslation(translation: vec3) {
		if (this._rapierHandle == null) return;
		const rb = Engine.physics.getRigidBody(this._rapierHandle);
		rb?.setNextKinematicTranslation({
			x: translation[0],
			y: translation[1],
			z: translation[2]
		})
	}

	public get isStatic(): boolean {
		return this.bodyType === 'static'
	}

	public get rapierHandle(): Rapier.RigidBodyHandle | null {
		return this._rapierHandle
	}
}

export interface SphereShape {
	kind: 'sphere',
	radius: number
}

export interface CylinderShape {
	kind: 'cylinder',
	halfHeight: number,
	radius: number,
}

export interface BoxShape {
	kind: 'box',
	halfWidth: number,
	halfHeight: number,
	halfDepth: number,
}

export interface CapsuleShape {
	kind: 'capsule',
	halfHeight: number,
	radius: number,
}

export type PhysicsShape = SphereShape | CylinderShape | BoxShape | CapsuleShape;

// Our interfaces allow for serialization of these shapes later,
// but we can then take this and convert to Rapier types so that
// the physics engine can use them.
export function shapeToColliderDesc(shape: PhysicsShape): Rapier.ColliderDesc {
	switch (shape.kind) {
		case 'sphere': 
			return Rapier.ColliderDesc.ball(shape.radius);
		case 'cylinder':
			return Rapier.ColliderDesc.cylinder(shape.halfHeight, shape.radius)
		case 'box':
			return Rapier.ColliderDesc.cuboid(shape.halfWidth, shape.halfHeight, shape.halfDepth)
		case 'capsule':
			return Rapier.ColliderDesc.capsule(shape.halfHeight, shape.radius)
		default:
			throw new Error("Unsupported shape, cannot get collider desc")
	}
}