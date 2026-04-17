import { getGL } from "./gl";

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

	public Buffer() {
		const gl = getGL();
		gl.deleteBuffer(this.VertexBuffer);

		this.VertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(this.Data),
			gl.STATIC_DRAW
		);
	}

	public Bind(location: number) {
		const gl = getGL();
		gl.enableVertexAttribArray(location);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(
			location,
			this.ElementsPerVertex,
			this.ElementTypeToGLEnum(this.ElementType),
			false,
			0,
			0
		);
	}

	private ElementTypeToGLEnum(type: DataType) {
		const gl = getGL();
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

export class Mesh {
	public VertexAttrs: VertexAttribute[];
	public Indices: number[] = [];
	public VAO: WebGLVertexArrayObject = 0

	private _index_buffer: WebGLBuffer | null = null;

	public constructor(...attributes: VertexAttribute[]) {
		this.VertexAttrs = attributes;
	}

	public Buffer() {
		this.BufferVertices();
		this.BufferIndices();
	}

	private BufferVertices() {
		const gl = getGL();
		this.VertexAttrs.forEach(attribute => {
			attribute.Buffer();
		});

		this.VAO = gl.createVertexArray();
		gl.bindVertexArray(this.VAO);

		this.VertexAttrs.forEach((attribute, index) => {
			attribute.Bind(index);
		})
	}

	private BufferIndices() {
		const gl = getGL();
		this._index_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index_buffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint32Array(this.Indices),
			gl.STATIC_DRAW
		);
	}

	public Draw() {
		const gl = getGL();
		gl.bindVertexArray(this.VAO);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index_buffer);
		gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_INT, 0);
	}

	public IsBuffered(): boolean {
		return this._index_buffer != null;
	}
}
