// This class makes it easy to get a 2D grid of something
// internally it stores it 1D
// 
// Say you have a 3x3 grid of something. So you see it as:
//
// 0 1 2
// 3 4 5
// 6 7 8
//
// But internally it lays it out as:
// 0 1 2 3 4 5 6 7 8
//
// Y makes it skip by 3 (width) and X makes it move forward by 1
// thus storing something 2D in a 1D array internally.
export class Array2D<T> {
	private _data: T[] = [];
	private width: number;
	private height: number;

	public constructor(width: number, height: number, start: () => T) {
		this.width = width;
		this.height = height;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this._data.push(start());
			}
		}
	}

	public Set(t: T, x: number, y: number) {
		this._data[(y * this.width) + x] = t;
	}

	public Get(x: number, y: number): T | undefined {
		return this._data[(y * this.width) + x];
	}

	public get Width() {
		return this.width;
	}

	public get Height() {
		return this.height;
	}
}

