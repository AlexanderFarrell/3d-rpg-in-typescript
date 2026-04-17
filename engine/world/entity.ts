export class Component {
	entity: Entity | null = null;
	onStart(): void {}
	onEnd(): void {}
}

// When you say "class Orange" in JavaScript/TypeScript, "Orange" is the
// class name. This "Orange" class name has a constructor, which you can call
// by saying "new Orange()"
//
// So this type here says "whatever is passed in must be able to call new and return it"
// ...so "Orange" would satisfy this, because we can do "new Orange()" and get an Orange back.
type ComponentConstructor<T extends Component> = new (...args: any[]) => T;

export class Entity {
	private _components = new Map<ComponentConstructor<any>, Component>();

	constructor(...components: Component[]) {
		// Add them first, then call onStart.
		components.forEach(component => {
			this.add(component, false);
		})

		components.forEach(component => {
			component.onStart();
		})
	}

	add<T extends Component>(component: T, setup: boolean = true): T {
		// Instances of a class know their own constructor, we get it.
		const kind = component.constructor as ComponentConstructor<T>;

		if (this.has(kind)) {
			throw new Error(`Entity already has a ${kind.name}`);
		}

		component.entity = this;
		this._components.set(kind, component);

		if (setup) {
			component.onStart();
		}
		return component;
	}

	remove<T extends Component>(kind: ComponentConstructor<T>): void {
		const component = this.get(kind);
		if (!component) return;

		component.onEnd();
		component.entity = null;
		this._components.delete(kind);
	}

	has<T extends Component>(kind: ComponentConstructor<T>): boolean {
		return this._components.has(kind);
	}

	get<T extends Component>(kind: ComponentConstructor<T>): T | undefined {
		return this._components.get(kind) as T;
	}

	clear(): void {
		this._components.forEach(component => {
			component.onEnd();
			component.entity = null;
		})
		this._components.clear();
	}
}
