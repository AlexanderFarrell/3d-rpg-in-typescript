import type { mat4 } from "gl-matrix";
import type { Shader } from "./shader";
import type { Texture } from "./texture";

export class Material {
	private _shader: Shader;
	public Uniforms: Uniform[];
	
	constructor(shader: Shader, ...uniforms: Uniform[]) {
		this.Uniforms = uniforms;
		this._shader = shader;
	}

	Bind(gl: WebGL2RenderingContext) {
		this._shader.bind(gl);
		this.Uniforms.forEach(uniform => {
			if (!uniform.IsReady()) uniform.Prepare(gl, this._shader);
			uniform.Bind(gl, this._shader);
		})
	}
}

export abstract class Uniform {
	public Name: string;
	protected Location: WebGLUniformLocation | null = null;

	public constructor(name: string) {
		this.Name = name;
	}

	Prepare(gl: WebGL2RenderingContext, shader: Shader) {
		this.Location = shader.get_uniform_location(gl, this.Name);
	}

	IsReady(): boolean {
		return this.Location !== null;
	}

	abstract Bind(gl: WebGL2RenderingContext, shader: Shader): void;
}

export class UniformTexture extends Uniform {
	public Texture: Texture;

	public constructor(name: string, texture: Texture) {
		super(name);
		this.Texture = texture;
	}

	Bind(gl: WebGL2RenderingContext, shader: Shader): void {
		this.Texture.Bind(gl);
		gl.uniform1i(this.Location, 0);
	}
}

export class UniformMat4 extends Uniform {
	public Mat4: mat4;

	public constructor(name: string, mat4: mat4) {
		super(name);
		this.Mat4 = mat4;
	}

	Bind(gl: WebGL2RenderingContext, shader: Shader): void {
		gl.uniformMatrix4fv(this.Location, false, this.Mat4)
	}
}