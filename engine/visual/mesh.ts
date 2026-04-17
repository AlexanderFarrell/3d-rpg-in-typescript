export enum DataType {
	Integer,
	Float
}

export class VertexAttribute {
	public Data: number[];
	public VertexBuffer: WebGLBuffer | null;

	public ElementsPerVertex: number;
	public ElementType: DataType = DataType.Float;

	public constructor(elements_per_vertex: number, ...data: number[]) {
		this.Data = data;
		this.ElementsPerVertex = elements_per_vertex;
		this.VertexBuffer = null;
	}

	public Buffer(gl: WebGL2RenderingContext) {
		gl.deleteBuffer(this.VertexBuffer);

		this.VertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(this.Data),
			gl.STATIC_DRAW
		);
	}

	public Bind(gl: WebGL2RenderingContext, location: number) {
		gl.enableVertexAttribArray(location);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(
			location,
			this.ElementsPerVertex,
			this.ElementTypeToGLEnum(gl, this.ElementType),
			false,
			0,
			0
		);
	}

	private ElementTypeToGLEnum(gl: WebGL2RenderingContext, type: DataType) {
		switch (type) {
			case DataType.Integer:
				return gl.INT
			case DataType.Float:
				return gl.FLOAT
			default:
				throw new Error("Unknown type")
		}
	}
}

// Stores the mesh on the CPU, and then can buffer it on the GPU
export class Mesh {
	public VertexAttrs: VertexAttribute[];
	public Indices: number[] = [];
	public VAO: WebGLVertexArrayObject = 0

	private _index_buffer: WebGLBuffer | null = null;

	public constructor(...attributes: VertexAttribute[]) {
		this.VertexAttrs = attributes;
	}

	public Buffer(gl: WebGL2RenderingContext) {
		this.BufferVertices(gl);
		this.BufferIndices(gl);
	}

	private BufferVertices(gl: WebGL2RenderingContext) {
		this.VertexAttrs.forEach(attribute => {
			attribute.Buffer(gl);
		});

		// Initialize the VAO
		this.VAO = gl.createVertexArray();
		gl.bindVertexArray(this.VAO);

		this.VertexAttrs.forEach((attribute, index) => {
			attribute.Bind(gl, index);
		})
	}

	private BufferIndices(gl: WebGL2RenderingContext) {
		this._index_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index_buffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint32Array(this.Indices), // I'm lazy, we could probably use Uint16 later
			gl.STATIC_DRAW
		);
	}

	public Draw(gl: WebGL2RenderingContext) {
		gl.bindVertexArray(this.VAO);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index_buffer);
		gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_INT, 0);
	}

	public IsBuffered(): boolean {
		return this._index_buffer != null;
	}
}