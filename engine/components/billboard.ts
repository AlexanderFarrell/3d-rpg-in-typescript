import { mat4 } from "gl-matrix";
import { TexturedFragmentGLSL, TexturedVertexGLSL } from "../assets/asset_map";
import { Engine } from "../main";
import { Material, UniformMat4, UniformTexture } from "../visual/material";
import { Mesh, VertexAttribute } from "../visual/mesh";
import { Shader, ShaderSource, ShaderType } from "../visual/shader";
import type { Texture } from "../visual/texture";
import { Visual, type Drawable } from "../visual/visual";
import { Component } from "../world/entity";
import { Location } from "./location";

export class Billboard extends Component implements Drawable {
	private _texture: Texture;
	private _material: Material | null = null;
	private _location: Location | null = null;
	private _mvpMatrix: mat4 = mat4.create();

	public constructor(texture: Texture) {
		super();
		this._texture = texture;
	}

	on_start(): void {
		let location = this.entity!.get(Location);
		if (location == null) {
			location = this.entity!.add(new Location());
		}
		this._location = location;
		Engine.Visual.Register(this);
	}

	on_end(): void {
		Engine.Visual.Unregister(this);
	}

	Setup(gl: WebGL2RenderingContext): void {
		// Lazy buffer the shared mesh if not already
		if (!mesh.IsBuffered()) {
			mesh.Buffer(gl);
			shader.Setup(gl);
		}

		if (!this._texture.IsBuffered()) {
			this._texture.Buffer(gl);
		}

		this._material = new Material(shader, 
			new UniformMat4("u_camera", Engine.Visual.Camera.Matrix),
			new UniformTexture("u_texture", this._texture)
		);
	}

	Breakdown(gl: WebGL2RenderingContext): void {
	}

	Draw(gl: WebGL2RenderingContext): void {
		this._location?.Refresh();
		mat4.mul(this._mvpMatrix, Engine.Visual.Camera.Matrix, this._location!.Matrix);
		(this._material!.Uniforms[0] as UniformMat4).Mat4 = this._mvpMatrix;
		this._material!.Bind(gl);
		mesh.Draw(gl);
	}
}

// Shared mesh
let mesh = new Mesh(
	// Positions (attribute 0)
	new VertexAttribute(3,
		0, 0, 0,
		1, 0, 0,
		1, 1, 0,
		0, 1, 0
	),
	// UVs (attribute 1)
	new VertexAttribute(2,
		0, 0,
		1, 0,
		1, 1,
		0, 1
	)
);
mesh.Indices = [0, 1, 2, 0, 2, 3];

// Shared shader
let shader = new Shader(
	new ShaderSource(
		ShaderType.Vertex,
		TexturedVertexGLSL
	),
	new ShaderSource(
		ShaderType.Fragment,
		TexturedFragmentGLSL
	)
);