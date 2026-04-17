import { mat4, quat, vec3 } from "gl-matrix";
import { Location } from "../math/location";


export abstract class Camera {
	// Positions objects from the 3D world space
	// into a spot based on the camera. In other words,
	// it makes the camera the center of the universe.
	private ViewMatrix: mat4;

	private ProjectionMatrix: mat4;
	private Location: Location;

	private _matrix: mat4;

	// Cached values for view matrix
	private _target: vec3 = [0, 0, 0];
	private _forward: vec3 = [0, 0, 1];
	private _up: vec3 = [0, 1, 0];

	protected constructor() {
		this.ViewMatrix = mat4.create();
		this.ProjectionMatrix = mat4.create();
		this._matrix = mat4.create();
		this.Location = new Location();
	}

	public Update() {
		this.RefreshView();
		this.RefreshProjection();
		mat4.mul(this._matrix, this.ProjectionMatrix, this.ViewMatrix);
	}

	abstract RefreshProjection(): void;

	private RefreshView() {
		this._forward[0] = 0;
		this._forward[1] = 0;
		this._forward[2] = 1;

		vec3.transformQuat(this._forward, this._forward, this.Location.Rotation);
		vec3.add(this._target, this.Location.Position, this._forward);

		mat4.lookAt(this.ViewMatrix, this.Location.Position, this._target, this._up);
	}

	public get Matrix() {
		return this._matrix;
	}
}

export class PerspectiveCamera extends Camera {
	// Ratio of width/height of the monitor/view
	public AspectRatio: number;

	// Angle of left side of eye to right side of eye.
	public Fov: number;

	// How close can objects be viewed before clipped?
	public NearPlane: number = 0.5;

	// How far can objects be viewed before clipped?
	public FarPlane: number = 200.0;

	public constructor(aspectRatio: number, fov: number = 85.0) {
		super();
		this.AspectRatio = aspectRatio;
		this.Fov = fov;
	}

	RefreshProjection(): void {
		throw new Error("Method not implemented.");
	}
}