import { mat4, vec3 } from "gl-matrix";
import { Location } from "../components/location";
import type { Drawable } from "./visual";

export abstract class Camera implements Drawable {
	private ViewMatrix: mat4;
	protected ProjectionMatrix: mat4;
	private Location: Location;
	private _matrix: mat4;

	private _target: vec3 = [0, 0, 0];
	private _forward: vec3 = [0, 0, -1];
	private _up: vec3 = [0, 1, 0];

	protected constructor() {
		this.ViewMatrix = mat4.create();
		this.ProjectionMatrix = mat4.create();
		this._matrix = mat4.create();
		this.Location = new Location();
	}

	Setup(): void {}
	Breakdown(): void {}

	Draw(): void {
		this.RefreshView();
		this.RefreshProjection();
		mat4.mul(this._matrix, this.ProjectionMatrix, this.ViewMatrix);
	}

	abstract RefreshProjection(): void;

	private RefreshView() {
		this._forward[0] = 0;
		this._forward[1] = 0;
		this._forward[2] = -1;

		vec3.transformQuat(this._forward, this._forward, this.Location.Rotation);
		vec3.add(this._target, this.Location.Position, this._forward);

		mat4.lookAt(this.ViewMatrix, this.Location.Position, this._target, this._up);
	}

	public get Matrix() {
		return this._matrix;
	}
}

export class PerspectiveCamera extends Camera {
	public AspectRatio: number;
	public Fov: number;
	public NearPlane: number = 0.5;
	public FarPlane: number = 200.0;

	public constructor(aspectRatio: number, fov: number = 85.0) {
		super();
		this.AspectRatio = aspectRatio;
		this.Fov = fov;
	}

	RefreshProjection(): void {
		mat4.perspective(
			this.ProjectionMatrix,
			this.Fov * (Math.PI / 180),
			this.AspectRatio,
			this.NearPlane,
			this.FarPlane
		);
	}
}
