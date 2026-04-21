export class Time {
	private _lastTime: number = 0;
	private _delta = 0.0;

	public onStartUpdate(timestamp: number = 0) {
		this._delta = Math.min((timestamp - this._lastTime) / 1000, 1.0);
		this._lastTime = timestamp;
	}

	public get Delta(): number {
		return this._delta;
	}
}