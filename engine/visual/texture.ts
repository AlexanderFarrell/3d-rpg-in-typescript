import { Array2D } from "../util/array2d";
import { Color } from "./color";
import { getGL } from "./gl";

export class Texture {
	public data: Array2D<Color>;
	private _glTexture: WebGLTexture | null = null;

	public constructor(width: number, height: number) {
		this.data = new Array2D(width, height, () => new Color(0.0, 0.0, 0.0));
	}

	public static fromColor(color: Color): Texture {
		let texture = new Texture(1, 1);
		texture.data.set(color, 0, 0);
		return texture;
	}

	public static fromImage(image: HTMLImageElement): Texture {
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(image, 0, 0);
		const pixels = ctx.getImageData(0, 0, image.width, image.height).data;

		const texture = new Texture(image.width, image.height);
		for (let y = 0; y < image.height; y++) {
			for (let x = 0; x < image.width; x++) {
				const i = (y * image.width + x) * 4;
				texture.data.set(
					new Color(pixels[i]! / 255, pixels[i+1]! / 255, pixels[i+2]! / 255, pixels[i+3]! / 255),
					x, y
				);
			}
		}
		return texture;
	}

	public static fromURL(url: string): Texture {
		const texture = new Texture(1, 1);
		const img = new Image();
		img.src = url;
		img.addEventListener('load', () => {
			const loaded = Texture.fromImage(img);
			texture.data = loaded.data;
			if (texture.isBuffered()) {
				texture.buffer();
			}
		});
		return texture;
	}

	private toUint8Array(): Uint8Array {
		const w = this.data.width;
		const h = this.data.height;
		const buf = new Uint8Array(w * h * 4);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const c = this.data.get(x, y)!;
				const i = (y * w + x) * 4;
				buf[i]     = Math.round(c.red   * 255);
				buf[i + 1] = Math.round(c.green * 255);
				buf[i + 2] = Math.round(c.blue  * 255);
				buf[i + 3] = Math.round(c.alpha * 255);
			}
		}
		return buf;
	}

	public buffer() {
		const gl = getGL();
		if (this._glTexture) {
			gl.deleteTexture(this._glTexture);
		}
		const tex = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA,
			this.data.width, this.data.height, 0,
			gl.RGBA, gl.UNSIGNED_BYTE,
			this.toUint8Array()
		);
		gl.generateMipmap(gl.TEXTURE_2D);
		this._glTexture = tex;
	}

	public isBuffered(): boolean {
		return this._glTexture !== null;
	}

	public bind(unit: number = 0) {
		const gl = getGL();
		gl.activeTexture(gl.TEXTURE0 + unit);
		gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
	}

	public destroy() {
		const gl = getGL();
		if (this._glTexture) {
			gl.deleteTexture(this._glTexture);
			this._glTexture = null;
		}
	}
}
