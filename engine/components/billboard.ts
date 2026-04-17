import { TexturedFragmentGLSL, TexturedVertexGLSL } from "../assets/asset_map";
import { Engine } from "../main";
import { Material, UniformMat4, UniformTexture } from "../visual/material";
import { Mesh, VertexAttribute } from "../visual/mesh";
import { Shader, ShaderSource, ShaderType } from "../visual/shader";
import type { Texture } from "../visual/texture";
import { Visual, type Drawable } from "../visual/visual";
import { Component } from "../world/entity";


class Billboard extends Component implements Drawable {
	private _texture: Texture;
	private _material: Material | null = null;

	public constructor(texture: Texture) {
		super();
		this._texture = texture;
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
		(this._material!.Uniforms[0] as UniformMat4).Mat4 = Engine.Visual.Camera.Matrix;
		this._material!.Bind(gl);
		mesh.Draw(gl);
	}
}

// Shared mesh
let mesh = new Mesh(
	// Positions
	new VertexAttribute(3, 
		0, 0, 0,
		0, 1, 0,
		1, 0, 0,
		1, 1, 0
	)
);

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