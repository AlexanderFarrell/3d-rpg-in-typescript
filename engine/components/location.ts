import { mat4, quat, vec3 } from "gl-matrix";
import { Component } from "../world/entity";

export class Location extends Component {
	public Position: vec3;
	public Rotation: quat;
	public Scale: vec3;

	private _matrix: mat4;

	public constructor(
		position: vec3 = [0, 0, 0],
		rotation: quat = quat.create(),
		scale: vec3 = [1, 1, 1],
	) {
		super();
		this.Position = position;
		this.Rotation = rotation;
		this.Scale = scale;
		this._matrix = mat4.identity(mat4.create());
	}

	public get Matrix() {
		return this._matrix;
	}

	public Refresh() {
		mat4.identity(this._matrix);
		mat4.fromRotationTranslationScale(this._matrix, this.Rotation, this.Position, this.Scale);
	}
}