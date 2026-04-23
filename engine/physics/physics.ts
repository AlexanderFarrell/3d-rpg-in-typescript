import type { Location } from "../components/location";
import type { Array2D } from "../util/array2d";
import { Component } from "../world/entity";

export interface Sphere {
	radius: number;
}

export interface Box {
	halfWidth: number;
	halfHeight: number;
	halfDepth: number;
}

export interface Cylinder {
	radius: number;
	height: number;
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
		this.location = 
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
			if (b.shape instanceof )
		}
	}
}