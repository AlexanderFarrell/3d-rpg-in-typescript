let _gl: WebGL2RenderingContext | null = null;

export function setGL(gl: WebGL2RenderingContext) {
	_gl = gl;
}

export function getGL(): WebGL2RenderingContext {
	if (_gl == null) throw new Error("WebGL2 context not initialized");
	return _gl;
}
