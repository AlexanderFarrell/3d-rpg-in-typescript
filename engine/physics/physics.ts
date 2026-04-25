import Rapier from "@dimforge/rapier3d-compat"

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