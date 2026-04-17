import { getGL } from "./gl";
import type { mat4 } from "gl-matrix";
import type { Shader } from "./shader";
import type { Texture } from "./texture";

export class Material {
	private _shader: Shader;
	public uniforms: Uniform[];

	constructor(shader: Shader, ...uniforms: Uniform[]) {
		this.uniforms = uniforms;
		this._shader = shader;
	}

	bind() {
		this._shader.bind();
		this.uniforms.forEach(uniform => {
			if (!uniform.isReady()) uniform.prepare(this._shader);
			uniform.bind(this._shader);
		})
	}
}

export abstract class Uniform {
	public name: string;
	protected location: WebGLUniformLocation | null = null;

	public constructor(name: string) {
		this.name = name;
	}

	prepare(shader: Shader) {
		this.location = shader.getUniformLocation(this.name);
	}

	isReady(): boolean {
		return this.location !== null;
	}

	abstract bind(shader: Shader): void;
}

export class UniformTexture extends Uniform {
	public texture: Texture;

	public constructor(name: string, texture: Texture) {
		super(name);
		this.texture = texture;
	}

	bind(_shader: Shader): void {
		this.texture.bind();
		getGL().uniform1i(this.location, 0);
	}
}

export class UniformMat4 extends Uniform {
	public mat4: mat4;

	public constructor(name: string, mat4: mat4) {
		super(name);
		this.mat4 = mat4;
	}

	bind(_shader: Shader): void {
		getGL().uniformMatrix4fv(this.location, false, this.mat4)
	}
}

export class UniformFloat extends Uniform {
	public value: number;

	public constructor(name: string, value: number) {
		super(name);
		this.value = value;
	}

	bind(_shader: Shader): void {
		getGL().uniform1f(this.location, this.value);
	}
}

export class UniformVec3 extends Uniform {
	public value: [number, number, number];

	public constructor(name: string, x: number, y: number, z: number) {
		super(name);
		this.value = [x, y, z];
	}

	bind(_shader: Shader): void {
		getGL().uniform3fv(this.location, this.value);
	}
}
