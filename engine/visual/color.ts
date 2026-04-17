import type { vec3 } from "gl-matrix";

// Defines a color out of RGBA values
export class Color {
	public Red: number;
	public Green: number;
	public Blue: number;
	public Alpha: number;

	// Makes a new color, alpha has a default in case we don't want to specify.
	// It defaults to fully opaque (no transparency)
	constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
		this.Red = red;
		this.Green = green;
		this.Blue = blue;
		this.Alpha = alpha;
	}

	public get Vec3(): vec3 {
		return [this.Red, this.Green, this.Blue]
	}

	// Feel free to add as many as you like/need
	static readonly Blue = new Color(0, 0, 1);
}
