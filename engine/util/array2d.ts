// Stores a 2D grid backed by a 1D array.
// A 3x3 grid is laid out as indices 0–8, where y skips by width and x moves by 1.
//
// So for example:
//   0 1 2
//   3 4 5
//   6 7 8
//
// Is really just laid out like: 0 1 2 3 4 5 6 7 8
//
// But using (y * width) + x, we can treat it like its 2 dimensional.
export class Array2D<T> {
	private _data: T[] = [];
	private _width: number;
	private _height: number;

	public constructor(width: number, height: number, start: () => T) {
		this._width = width;
		this._height = height;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this._data.push(start());
			}
		}
	}

	public set(t: T, x: number, y: number) {
		this._data[(y * this._width) + x] = t;
	}

	public get(x: number, y: number): T | undefined {
		return this._data[(y * this._width) + x];
	}

	public get width() {
		return this._width;
	}

	public get height() {
		return this._height;
	}

	public get_bilinear(x: number, y: number): number {
		
	}
}
