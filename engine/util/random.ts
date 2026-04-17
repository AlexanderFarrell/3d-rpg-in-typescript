export class Random {
	static next(min: number, max: number) {
		return (Math.random() * (max - min)) + min;
	}
}
