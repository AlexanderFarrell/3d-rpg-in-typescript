import { Entity, type Component } from "./entity";

export interface Updatable {
	onUpdate(): void;
}

export class World {
	public entities: Set<Entity> = new Set();
	public updatables: Set<Updatable> = new Set();

	makeEntity(...components: Component[]): Entity {
		let entity = new Entity(...components);
		this.entities.add(entity);
		return entity;
	}

	update() {
		this.updatables.forEach(updatable => {
			updatable.onUpdate();
		})
	}
}
