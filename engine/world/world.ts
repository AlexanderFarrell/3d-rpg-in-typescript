import { Entity, type Component } from "./entity";

export interface Updatable {
	OnUpdate(): void;
}

export class World {
	public Entities: Set<Entity> = new Set();
	public Updatables: Set<Updatable> = new Set();

	MakeEntity(...components: Component[]): Entity {
		let entity = new Entity(...components);
		this.Entities.add(entity);
		return entity;
	}

	Update() {
		this.Updatables.forEach(updatable => {
			updatable.OnUpdate();
		})
	}
}