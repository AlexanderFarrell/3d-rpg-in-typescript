import { vec3 } from "gl-matrix";
import type { Location } from "../components/location";
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
		if (!this.entity!.has())
		this.location = this.entity!.get
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
	let aHighY = a.height/2 + aLoc.position[1];
	let bHighY = b.height/2 + bLoc.position[1];
	let aLowY = aHighY + a.height/2;
	let bLowY = bHighY + b.height/2;
	if (aLoc.position[1] > bHighY ||
		aLoc.position[1] < bLowY ||
		bLoc.position[1] > aHighY ||
		bLoc.position[1] < aLowY
	) {
		
	} 

	return false;
}