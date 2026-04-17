import {Engine} from "engine";
import "./assets/style.css";
import { Component, Entity } from "engine/world/entity";
import type { Updatable } from "engine/world/world";
import { Visual } from "engine/visual/visual";

class WorldGraphics extends Component implements Updatable {
	public constructor() {
		super();
	}

	public on_start(): void {
		Engine.World.Updatables.add(this)
	}

	public on_end(): void {
		Engine.World.Updatables.delete(this);
	}

	public OnUpdate(): void {
		Engine.Visual.ClearColor.Red += 0.01;
		if (Engine.Visual.ClearColor.Red > 1.0) {
			Engine.Visual.ClearColor.Red = 0.0;
		}
	}
}

function on_start() {
	Engine.World.MakeEntity(new WorldGraphics());
}

Engine.start(on_start);