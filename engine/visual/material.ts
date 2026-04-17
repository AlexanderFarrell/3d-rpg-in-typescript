import type { Shader } from "./shader";


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

	abstract Bind(gl: WebGL2RenderingContext, shader: Shader): void;
}
