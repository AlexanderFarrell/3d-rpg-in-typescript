

export interface ShaderSource {
	kind: number,
	src: string,
}

export class Shader {
	private _program: WebGLProgram;

	constructor(gl: WebGL2RenderingContext, ...sources: ShaderSource[]) {
		this._program = gl.createProgram();

		sources.forEach(source => {
			let shader = this.LoadShader(gl, source);
			
		})
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

