import { vec3 } from "gl-matrix";
import { Location } from "../components/location";
import type { Array2D } from "../util/array2d";
import { Component } from "../world/entity";

export class Sphere {
	radius: number;

	public constructor(radius: number) {
		this.radius = radius;
	}
}

export class Cylinder {
	radius: number;
	height: number;

	public constructor(radius: number, height: number) {
		this.radius = radius;
		this.height = height;
	}
}

export type Shape = Sphere | Cylinder;

export class PhysicalObj extends Component {
	shape: Shape;
	location: Location | null = null;

	public constructor(shape: Shape) {
		super();
		this.shape = shape;
	}

	onStart(): void {
		// Physical object needs a location so that 
		// it knows where the object is.
		if (!this.entity!.has(Location)) {
			this.entity!.add(new Location());
		}
		this.location = this.entity!.get(Location)!;
	}
}

export class Physics {
	public intersects(a: PhysicalObj, b: PhysicalObj): boolean {
		if (a.shape instanceof Sphere) {
			if (b.shape instanceof Sphere) {

			} 
			else if (b.shape instanceof Cylinder) {

			}
		}
		else if (a.shape instanceof Cylinder) {
			if (b.shape instanceof Sphere) {

			}
			else if (b.shape instanceof Cylinder) {

			}
		}
	}
}

function DoesSphereIntersectSphere(
	a: Sphere,
	b: Sphere,
	aLoc: Location,
	bLoc: Location,
) {
	// Get distance
	let distance = vec3.distance(aLoc.position, bLoc.position);
	return distance < (a.radius + b.radius);
}

function DoesCylinderIntersectCylinder(
	a: Cylinder,
	b: Cylinder,
	aLoc: Location,
	bLoc: Location
) {
	//Ensure the heights are within range
	const aMinY = aLoc.Y - a.height / 2;
    const aMaxY = aLoc.Y + a.height / 2;
    const bMinY = bLoc.Y - b.height / 2;
    const bMaxY = bLoc.Y + b.height / 2;
	
	// No vertical overlap → no collision
    if (aMaxY < bMinY || bMaxY < aMinY) return false;

	// Since Y overlaps, check if X and Z overlap
	// and if they do, we are colliding.
	const distanceX = aLoc.X - bLoc.X;
	const distanceZ = aLoc.Z - bLoc.Z;

	// Distance formula is essentially the pythagorean theorum:
	// a^2 + b^2 = c^2
	// In this case, X is a, and Z is b. We just find C
	// ...except finding sqrt is expensive... so I have a trick
	// up my sleeve.
	const distanceSquared = distanceX * distanceX + distanceZ + distanceZ;

	const radiusSum = a.radius + b.radius;

	// This... we can just square the radius (instead of getting
	// sqrt() of the distance). Faster.
	return distanceSquared < radiusSum * radiusSum;
}


let distanceVec3 = vec3.create();

function DoesSphereIntersectCylinder(
	sphere: Sphere,
	cylinder: Cylinder,
	sphereLoc: Location,
	cylinderLoc: Location,
) {
	// Cylindrical coords:
	const distanceX = sphereLoc.X - cylinderLoc.X;
	const distanceZ = sphereLoc.Z - cylinderLoc.Z;
	const radialDistance = Math.sqrt(
		distanceX * distanceX +
		distanceZ * distanceZ
	);

	// 
}