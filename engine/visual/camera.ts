import { mat4, vec3 } from "gl-matrix";
import { Location } from "../components/location";
import type { Drawable } from "./visual";

export abstract class Camera implements Drawable {
	private _viewMatrix: mat4;
	protected _projectionMatrix: mat4;
	public location: Location;
	private _matrix: mat4;

	private _target: vec3 = [0, 0, 0];
	private _forward: vec3 = [0, 0, 1];
	private _up: vec3 = [0, 1, 0];

	protected constructor() {
		this._viewMatrix = mat4.create();
		this._projectionMatrix = mat4.create();
		this._matrix = mat4.create();
		this.location = new Location();
	}

	setup(): void {}
	breakdown(): void {}

	draw(): void {
		this.refreshView();
		this.refreshProjection();
		mat4.mul(this._matrix, this._projectionMatrix, this._viewMatrix);
	}

	abstract refreshProjection(): void;

	private refreshView() {
		this._forward[0] = 0;
		this._forward[1] = 0;
		this._forward[2] = 1;

		vec3.transformQuat(this._forward, this._forward, this.location.rotation);
		vec3.add(this._target, this.location.position, this._forward);

		mat4.lookAt(this._viewMatrix, this.location.position, this._target, this._up);
	}

	public get matrix() {
		return this._matrix;
	}
}

export class PerspectiveCamera extends Camera {
	public aspectRatio: number;
	public fov: number;
	public nearPlane: number = 0.5;
	public farPlane: number = 200.0;

	public constructor(aspectRatio: number, fov: number = 85.0) {
		super();
		this.aspectRatio = aspectRatio;
		this.fov = fov;
	}

	refreshProjection(): void {
		mat4.perspective(
			this._projectionMatrix,
			this.fov * (Math.PI / 180),
			this.aspectRatio,
			this.nearPlane,
			this.farPlane
		);
	}
}
