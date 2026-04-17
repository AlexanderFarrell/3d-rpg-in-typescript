

export interface ShaderSource {
	kind: number,
	src: string,
}

export class Shader {
	private _program: WebGLProgram;

	constructor(gl: WebGL2RenderingContext, ...sources: ShaderSource[]) {
		this._program = gl.createProgram();

		const shaders = sources.map(source => {
			let shader = this.LoadShader(gl, source);
			gl.attachShader(this._program, shader);
			return shader;
		})

		// Link everything together.
		gl.linkProgram(this._program);

		if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
			throw new Error("Error linking shader: " + gl.getProgramInfoLog(this._program));
		}

		// Clean up the attached source code (it's already compiled, no need to keep attached)
		shaders.forEach(shader => {
			gl.detachShader(this._program, shader);
			gl.deleteShader(shader);
		})
	}

	public get_uniform_location(gl: WebGL2RenderingContext, name: string) {
		let location = gl.getUniformLocation(this._program, name);
		if (location == null) {
			throw new Error("Failed to get uniform location for " + name);
		}
		return location!;
	}

	public get_attribute_location(gl: WebGL2RenderingContext, name: string) {
		let location = gl.getAttribLocation(this._program, name);
		if (location == null) {
			throw new Error("Failed to get attribute location for " + name);
		}
		return location!;
	}

	public bind(gl: WebGL2RenderingContext) {
		gl.useProgram(this._program);
	}

	public destroy(gl: WebGL2RenderingContext) {
		gl.deleteProgram(this._program);
	}

	private LoadShader(gl: WebGL2RenderingContext, source: ShaderSource): WebGLShader {
		// Make a new shader
		const shader = gl.createShader(source.kind);
		if (shader == null) {
			throw new Error("Failed to create new shader");
		}

		// Actually put the GLSL source code of the shader into it.
		gl.shaderSource(shader!, source.src);

		// Then compile the GLSL source code.
		gl.compileShader(shader);

		// Check that it worked, if not then throw
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const errorMessage = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw new Error("Error compiling shader: " + errorMessage);
		}
		return shader;
	}
}

