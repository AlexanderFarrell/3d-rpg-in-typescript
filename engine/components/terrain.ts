import { vec3 } from "gl-matrix";
import { Array2D } from "../util/array2d";
import { Material, UniformFloat, UniformMat4, UniformVec3 } from "../visual/material";
import { Mesh, VertexAttribute } from "../visual/mesh";
import type { Drawable } from "../visual/visual";
import { Component } from "../world/entity";
import { Color } from "../visual/color";
import { Shader, ShaderSource, ShaderType } from "../visual/shader";
import { ColorLitFragmentGLSL, ColorLitVertexGLSL } from "../assets/asset_map";
import { Engine } from "../main";

export class Terrain extends Component implements Drawable {
	public heightMap: Array2D<number>;
	private _mesh: Mesh | null = null;
	private _material: Material | null = null;
	private _normalMap: Array2D<vec3>;
	public cellSize: number = 1;

	public constructor(width: number, height: number) {
		super();
		this.heightMap = new Array2D(width, height, () => 1);
		this._normalMap = new Array2D(width, height, () => [0, 1, 0] as vec3);
	}

	onStart(): void {
		Engine.visual.register(this);
	}

	onEnd(): void {
		Engine.visual.unregister(this);
	}

	setup(): void {
		if (!terrainShader.isSetup()) {
			terrainShader.setup();
		}

		this._material = new Material(terrainShader,
			new UniformMat4("u_camera", Engine.visual.camera.matrix),
			new UniformVec3("u_light_direction", 1, 2, 1),
			new UniformFloat("u_ambient", 0.3)
		);

		this.updateMesh();
	}

	breakdown(): void {}

	draw(): void {
		(this._material!.uniforms[0] as UniformMat4).mat4 = Engine.visual.camera.matrix;
		this._material!.bind();
		this._mesh!.draw();
	}

	// Terrain functions

	private getNormalAt(x: number, y: number): vec3 {
		const h = this.heightMap;
		const l = h.get(x > 0            ? x - 1 : x, y)!;
		const r = h.get(x < h.width  - 1 ? x + 1 : x, y)!;
		const d = h.get(x, y > 0            ? y - 1 : y)!;
		const u = h.get(x, y < h.height - 1 ? y + 1 : y)!;
		const n = vec3.fromValues(l - r, 2.0, d - u);
		vec3.normalize(n, n);
		return n;
	}

	updateMesh() {
		if (this._mesh == null) {
			let counts = 3 * 4 * (this.heightMap.width - 1) * (this.heightMap.height - 1);

			this._mesh = new Mesh(
				new VertexAttribute(3, ...new Array<number>(counts).fill(0)), // Positions
				new VertexAttribute(3, ...new Array<number>(counts).fill(0)), // Normals
				new VertexAttribute(3, ...new Array<number>(counts).fill(0))  // Colors
			);
			this._mesh.indices = new Array<number>(6 * (this.heightMap.width - 1) * (this.heightMap.height - 1)).fill(0);
		}

		let positions = this._mesh.vertexAttrs[0];
		let normals = this._mesh.vertexAttrs[1];
		let colors = this._mesh.vertexAttrs[2];
		let indices = this._mesh.indices;

		let vertexOffset = 0;
		let indexOffset = 0;

		let setXYZ = (array: Array<number>, offset: number, x: number, y: number, z: number) => {
			array[offset + 0] = x;
			array[offset + 1] = y;
			array[offset + 2] = z;
		}
		let setXYZArray = (array: Array<number>, offset: number, value: vec3) => {
			array[offset + 0] = value[0];
			array[offset + 1] = value[1];
			array[offset + 2] = value[2];
		}

		let color = new Color(0.3, 0.8, 0.4);

		for (let y = 0; y < this.heightMap.height - 1; y++) {
			for (let x = 0; x < this.heightMap.width - 1; x++) {
				// Find normals first
				this._normalMap.set(this.getNormalAt(x + 0, y + 0), x + 0, y + 0);
				this._normalMap.set(this.getNormalAt(x + 1, y + 0), x + 1, y + 0);
				this._normalMap.set(this.getNormalAt(x + 0, y + 1), x + 0, y + 1);
				this._normalMap.set(this.getNormalAt(x + 1, y + 1), x + 1, y + 1);

				// Positions
				setXYZ(positions!.data, vertexOffset + 0,
					(x + 0) * this.cellSize,
					this.heightMap.get(x + 0, y + 0)!,
					(y + 0) * this.cellSize
				);
				setXYZ(positions!.data, vertexOffset + 3,
					(x + 1) * this.cellSize,
					this.heightMap.get(x + 1, y + 0)!,
					(y + 0) * this.cellSize
				);
				setXYZ(positions!.data, vertexOffset + 6,
					(x + 0) * this.cellSize,
					this.heightMap.get(x + 0, y + 1)!,
					(y + 1) * this.cellSize
				);
				setXYZ(positions!.data, vertexOffset + 9,
					(x + 1) * this.cellSize,
					this.heightMap.get(x + 1, y + 1)!,
					(y + 1) * this.cellSize
				)

				// Normals
				setXYZArray(normals!.data, vertexOffset + 0, this._normalMap.get(x + 0, y + 0)!);
				setXYZArray(normals!.data, vertexOffset + 3, this._normalMap.get(x + 1, y + 0)!);
				setXYZArray(normals!.data, vertexOffset + 6, this._normalMap.get(x + 0, y + 1)!);
				setXYZArray(normals!.data, vertexOffset + 9, this._normalMap.get(x + 1, y + 1)!);

				// Colors
				setXYZArray(colors!.data, vertexOffset + 0, color.vec3);
				setXYZArray(colors!.data, vertexOffset + 3, color.vec3);
				setXYZArray(colors!.data, vertexOffset + 6, color.vec3);
				setXYZArray(colors!.data, vertexOffset + 9, color.vec3);

				// Indices
				indices[indexOffset + 0] = vertexOffset/3 + 0;
				indices[indexOffset + 1] = vertexOffset/3 + 1;
				indices[indexOffset + 2] = vertexOffset/3 + 2;
				indices[indexOffset + 3] = vertexOffset/3 + 1;
				indices[indexOffset + 4] = vertexOffset/3 + 2;
				indices[indexOffset + 5] = vertexOffset/3 + 3;

				vertexOffset += 12;
				indexOffset += 6;
			}
		}

		this._mesh!.buffer();
	}
}

const terrainShader = new Shader(
	new ShaderSource(ShaderType.Vertex, ColorLitVertexGLSL),
	new ShaderSource(ShaderType.Fragment, ColorLitFragmentGLSL)
);
