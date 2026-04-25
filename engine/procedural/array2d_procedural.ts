import type { Array2D } from "../util/array2d";
import { Random } from "../util/random";

// Fills a square Array2D using diamond-square fractal. Size must be 2^n + 1.
export function diamondSquare(map: Array2D<number>, roughness = 0.55, initialScale = 20.0) {
	const size = map.width;
	map.set(Random.next(0, initialScale), 0,        0       );
	map.set(Random.next(0, initialScale), size - 1, 0       );
	map.set(Random.next(0, initialScale), 0,        size - 1);
	map.set(Random.next(0, initialScale), size - 1, size - 1);

	let step = size - 1;
	let scale = initialScale;
	while (step > 1) {
		const half = step >> 1;

		for (let y = 0; y < size - 1; y += step) {
			for (let x = 0; x < size - 1; x += step) {
				const avg = (
					map.get(x,        y       )! +
					map.get(x + step, y       )! +
					map.get(x,        y + step)! +
					map.get(x + step, y + step)!
				) / 4;
				map.set(avg + Random.next(-scale, scale), x + half, y + half);
			}
		}

		for (let y = 0; y < size; y += half) {
			for (let x = (y + half) % step; x < size; x += step) {
				let sum = 0, count = 0;
				if (x - half >= 0)   { sum += map.get(x - half, y)!; count++; }
				if (x + half < size) { sum += map.get(x + half, y)!; count++; }
				if (y - half >= 0)   { sum += map.get(x, y - half)!; count++; }
				if (y + half < size) { sum += map.get(x, y + half)!; count++; }
				map.set(sum / count + Random.next(-scale, scale), x, y);
			}
		}

		step = half;
		scale *= Math.pow(2, -roughness);
	}
}