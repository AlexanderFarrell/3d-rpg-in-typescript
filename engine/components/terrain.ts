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
	public HeightMap: Array2D<number>;
	private _mesh: Mesh | null = null;
	private _material: Material | null = null;
	private _normalMap: Array2D<vec3>;
	public CellSize: number = 1;

	public constructor(width: number, height: number) {
		super();
		this.HeightMap = new Array2D(width, height, () => 1);
		this._normalMap = new Array2D(width, height, () => [0, 1, 0] as vec3);
	}

	on_start(): void {
		Engine.Visual.Register(this);
	}

	on_end(): void {
		Engine.Visual.Unregister(this);
	}

	Setup(): void {
		if (!terrainShader.IsSetup()) {
			terrainShader.Setup();
		}

		this._material = new Material(terrainShader,
			new UniformMat4("u_camera", Engine.Visual.Camera.Matrix),
			new UniformVec3("u_light_direction", 1, 2, 1),
			new UniformFloat("u_ambient", 0.3)
		);

		this.UpdateMesh();
	}

	Breakdown(): void {}

	Draw(): void {
		(this._material!.Uniforms[0] as UniformMat4).Mat4 = Engine.Visual.Camera.Matrix;
		this._material!.Bind();
		this._mesh!.Draw();
	}

	// Terrain functions

	private GetNormalAt(x: number, y: number): vec3 {
		const h = this.HeightMap;
		const l = h.Get(x > 0            ? x - 1 : x, y)!;
		const r = h.Get(x < h.Width  - 1 ? x + 1 : x, y)!;
		const d = h.Get(x, y > 0            ? y - 1 : y)!;
		const u = h.Get(x, y < h.Height - 1 ? y + 1 : y)!;
		const n = vec3.fromValues(l - r, 2.0, d - u);
		vec3.normalize(n, n);
		return n;
	}

	UpdateMesh() {
		if (this._mesh == null) {
			let counts = 3 * 4 * (this.HeightMap.Width - 1) * (this.HeightMap.Height - 1);

			this._mesh = new Mesh(
				new VertexAttribute(3, ...new Array<number>(counts).fill(0)), // Positions
				new VertexAttribute(3, ...new Array<number>(counts).fill(0)), // Normals
				new VertexAttribute(3, ...new Array<number>(counts).fill(0))  // Colors
			);
			this._mesh.Indices = new Array<number>(6 * (this.HeightMap.Width - 1) * (this.HeightMap.Height - 1)).fill(0);
		}

		let positions = this._mesh.VertexAttrs[0];
		let normals = this._mesh.VertexAttrs[1];
		let colors = this._mesh.VertexAttrs[2];
		let indices = this._mesh.Indices;

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

		for (let y = 0; y < this.HeightMap.Height - 1; y++) {
			for (let x = 0; x < this.HeightMap.Width - 1; x++) {
				// Find normals first
				this._normalMap.Set(this.GetNormalAt(x + 0, y + 0), x + 0, y + 0);
				this._normalMap.Set(this.GetNormalAt(x + 1, y + 0), x + 1, y + 0);
				this._normalMap.Set(this.GetNormalAt(x + 0, y + 1), x + 0, y + 1);
				this._normalMap.Set(this.GetNormalAt(x + 1, y + 1), x + 1, y + 1);

				// Positions
				setXYZ(positions!.Data, vertexOffset + 0,
					(x + 0) * this.CellSize,
					this.HeightMap.Get(x + 0, y + 0)!,
					(y + 0) * this.CellSize
				);
				setXYZ(positions!.Data, vertexOffset + 3,
					(x + 1) * this.CellSize,
					this.HeightMap.Get(x + 1, y + 0)!,
					(y + 0) * this.CellSize
				);
				setXYZ(positions!.Data, vertexOffset + 6,
					(x + 0) * this.CellSize,
					this.HeightMap.Get(x + 0, y + 1)!,
					(y + 1) * this.CellSize
				);				
				setXYZ(positions!.Data, vertexOffset + 9,
					(x + 1) * this.CellSize,
					this.HeightMap.Get(x + 1, y + 1)!,
					(y + 1) * this.CellSize
				)

				// Normals
				setXYZArray(normals!.Data, vertexOffset + 0, this._normalMap.Get(x + 0, y + 0)!);
				setXYZArray(normals!.Data, vertexOffset + 3, this._normalMap.Get(x + 1, y + 0)!);
				setXYZArray(normals!.Data, vertexOffset + 6, this._normalMap.Get(x + 0, y + 1)!);
				setXYZArray(normals!.Data, vertexOffset + 9, this._normalMap.Get(x + 1, y + 1)!);

				// Colors
				setXYZArray(colors!.Data, vertexOffset + 0, color.Vec3);
				setXYZArray(colors!.Data, vertexOffset + 3, color.Vec3);
				setXYZArray(colors!.Data, vertexOffset + 6, color.Vec3);
				setXYZArray(colors!.Data, vertexOffset + 9, color.Vec3);

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

		this._mesh!.Buffer();
	}
}

const terrainShader = new Shader(
	new ShaderSource(ShaderType.Vertex, ColorLitVertexGLSL),
	new ShaderSource(ShaderType.Fragment, ColorLitFragmentGLSL)
);

