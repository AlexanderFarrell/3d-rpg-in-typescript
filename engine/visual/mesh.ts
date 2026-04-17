import { getGL } from "./gl";

export enum DataType {
	Integer,
	Float
}

export class VertexAttribute {
	public data: number[];
	public vertexBuffer: WebGLBuffer | null;

	public elementsPerVertex: number;
	public elementType: DataType = DataType.Float;

	public constructor(elementsPerVertex: number, ...data: number[]) {
		this.data = data;
		this.elementsPerVertex = elementsPerVertex;
		this.vertexBuffer = null;
	}

	public buffer() {
		const gl = getGL();
		gl.deleteBuffer(this.vertexBuffer);

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(this.data),
			gl.STATIC_DRAW
		);
	}

	public bind(location: number) {
		const gl = getGL();
		gl.enableVertexAttribArray(location);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(
			location,
			this.elementsPerVertex,
			this.elementTypeToGLEnum(this.elementType),
			false,
			0,
			0
		);
	}

	private elementTypeToGLEnum(type: DataType) {
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
	public vertexAttrs: VertexAttribute[];
	public indices: number[] = [];
	public vao: WebGLVertexArrayObject = 0

	private _indexBuffer: WebGLBuffer | null = null;

	public constructor(...attributes: VertexAttribute[]) {
		this.vertexAttrs = attributes;
	}

	public buffer() {
		this.bufferVertices();
		this.bufferIndices();
	}

	private bufferVertices() {
		const gl = getGL();
		this.vertexAttrs.forEach(attribute => {
			attribute.buffer();
		});

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		this.vertexAttrs.forEach((attribute, index) => {
			attribute.bind(index);
		})
	}

	private bufferIndices() {
		const gl = getGL();
		this._indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint32Array(this.indices),
			gl.STATIC_DRAW
		);
	}

	public draw() {
		const gl = getGL();
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
	}

	public isBuffered(): boolean {
		return this._indexBuffer != null;
	}
}
