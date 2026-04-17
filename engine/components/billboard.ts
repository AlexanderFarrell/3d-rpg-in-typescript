import { mat4 } from "gl-matrix";
import { TexturedFragmentGLSL, TexturedVertexGLSL } from "../assets/asset_map";
import { Engine } from "../main";
import { Material, UniformMat4, UniformTexture } from "../visual/material";
import { Mesh, VertexAttribute } from "../visual/mesh";
import { Shader, ShaderSource, ShaderType } from "../visual/shader";
import type { Texture } from "../visual/texture";
import { type Drawable } from "../visual/visual";
import { Component } from "../world/entity";
import { Location } from "./location";
import type { Updatable } from "../world/world";

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

	Setup(): void {
		if (!mesh.IsBuffered()) {
			mesh.Buffer();
			shader.Setup();
		}

		if (!this._texture.IsBuffered()) {
			this._texture.Buffer();
		}

		this._material = new Material(shader,
			new UniformMat4("u_camera", Engine.Visual.Camera.Matrix),
			new UniformTexture("u_texture", this._texture)
		);
	}

	Breakdown(): void {}

	Draw(): void {
		this._location?.Refresh();
		mat4.mul(this._mvpMatrix, Engine.Visual.Camera.Matrix, this._location!.Matrix);
		(this._material!.Uniforms[0] as UniformMat4).Mat4 = this._mvpMatrix;
		this._material!.Bind();
		mesh.Draw();
	}
}

let mesh = new Mesh(
	new VertexAttribute(3,
		0, 0, 0,
		1, 0, 0,
		1, 1, 0,
		0, 1, 0
	),
	new VertexAttribute(2,
		0, 1,
		1, 1,
		1, 0,
		0, 0
	)
);
mesh.Indices = [0, 1, 2, 0, 2, 3];

let shader = new Shader(
	new ShaderSource(ShaderType.Vertex, TexturedVertexGLSL),
	new ShaderSource(ShaderType.Fragment, TexturedFragmentGLSL)
);
