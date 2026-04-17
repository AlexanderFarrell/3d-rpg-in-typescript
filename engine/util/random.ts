

export class Random {
	static Next(min: number, max: number) {
		return (Math.random() * (max - min)) + min;
	}
}