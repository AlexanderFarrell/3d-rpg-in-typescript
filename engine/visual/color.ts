import type { vec3 } from "gl-matrix";

// Defines a color out of RGBA values
export class Color {
	public red: number;
	public green: number;
	public blue: number;
	public alpha: number;

	// Makes a new color, alpha defaults to fully opaque
	constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}

	public get vec3(): vec3 {
		return [this.red, this.green, this.blue]
	}

	// Feel free to add as many as you like/need
	static readonly blue = new Color(0, 0, 1);
}
