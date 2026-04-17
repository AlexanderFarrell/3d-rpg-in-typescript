import { getGL } from "./gl";

export enum ShaderType {
	Vertex,
	Fragment
}

export class ShaderSource {
	public kind: ShaderType;
	public code: string;

	public constructor(kind: ShaderType, code: string) {
		this.kind = kind;
		this.code = code;
	}

	public getGLType(): number {
		const gl = getGL();
		switch (this.kind) {
			case ShaderType.Vertex:
				return gl.VERTEX_SHADER;
			case ShaderType.Fragment:
				return gl.FRAGMENT_SHADER;
			default:
				throw new Error("Invalid type")
		}
	}
}

export class Shader {
	private _program: WebGLProgram | null = null;
	private _sources: ShaderSource[];

	constructor(...sources: ShaderSource[]) {
		this._sources = sources;
	}

	public setup() {
		const gl = getGL();
		this._program = gl.createProgram();

		const shaders = this._sources.map(source => {
			let shader = this.loadShader(source);
			gl.attachShader(this._program!, shader);
			return shader;
		})

		gl.linkProgram(this._program);

		if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
			throw new Error("Error linking shader: " + gl.getProgramInfoLog(this._program));
		}

		shaders.forEach(shader => {
			gl.detachShader(this._program!, shader);
			gl.deleteShader(shader);
		})
	}

	public getUniformLocation(name: string) {
		const gl = getGL();
		let location = gl.getUniformLocation(this._program!, name);
		if (location == null) {
			throw new Error("Failed to get uniform location for " + name);
		}
		return location;
	}

	public getAttributeLocation(name: string) {
		const gl = getGL();
		let location = gl.getAttribLocation(this._program!, name);
		if (location === -1) {
			throw new Error("Failed to get attribute location for " + name);
		}
		return location;
	}

	public bind() {
		getGL().useProgram(this._program);
	}

	public destroy() {
		getGL().deleteProgram(this._program);
	}

	private loadShader(source: ShaderSource): WebGLShader {
		const gl = getGL();
		const shader = gl.createShader(source.getGLType());
		if (shader == null) {
			throw new Error("Failed to create new shader");
		}

		gl.shaderSource(shader, source.code);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const errorMessage = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw new Error("Error compiling shader: " + errorMessage);
		}
		return shader;
	}

	public isSetup() {
		return this._program != null;
	}
}
