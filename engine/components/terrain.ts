import { Array2D } from "../util/array2d";
import type { Drawable } from "../visual/visual";
import { Component } from "../world/entity";

class Terrain extends Component implements Drawable {
	public HeightMap: Array2D<number>;

	public constructor(width: number, height: number) {
		super();
		this.HeightMap = new Array2D<number>(width, height, () => 1)
	}

	Draw(gl: WebGL2RenderingContext): void {
		
	}
}