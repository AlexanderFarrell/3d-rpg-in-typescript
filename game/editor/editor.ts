import { Engine } from "engine";
import { Stage } from "engine/app/stage";
import { ControlledOrbitCamera } from "engine/components/orbit_camera";
import { Terrain } from "engine/components/terrain";

enum EditorMode {
	Mouse,
	TerrainHeight,
	TerrainColor,
	EntityPlace,
	Editing,
}

// A map/world editor which can be played
// by the GameplayStage
export class EditorStage extends Stage {
	private _mode: EditorMode = EditorMode.Mouse;
	private _terrain: Terrain | null = null;

	name(): string {
		return "Editor";
	}
	
	on_start() {
		let ui = Engine.ui.UiContainer;
		ui.innerHTML = `
		<div id="editor_ui">
			<button name="quit">Back to Menu</button>
			<button name="new">New</button>
			<button name="load">Load</button>
			<button name="save">Save</button>
			<button name="mouse">Mouse</button>
			<button name="terrain">Terrain</button>
			<button name="entity">Entities</button>
			<button name="tables">Tables</button>
			<button name="world">World</button>
		</div>
		`

		let add_on_click = (name: string, on: () => void) => {
			ui.querySelector<HTMLButtonElement>(`[name="${name}"]`)!.addEventListener('click', on);
		}

		add_on_click('quit', () => {this.quit_to_menu()});
		add_on_click('new', () => {this.new_world()});
		add_on_click('save', () => {this.save_world()});
		add_on_click('load', () => {this.load_world()});
		add_on_click('mouse', () => {this._mode = EditorMode.Mouse})
		add_on_click('terrain', () => {this.open_terrain_tools()});
		add_on_click('entity', () => {this.open_entity_tools()});
		add_on_click('tables', () => {this.open_tables()});
		add_on_click('world', () => {this.open_world_settings()});

		let terrainEntity = Engine.world.makeEntity(
			new Terrain(65, 65)
		);
		this._terrain = terrainEntity.get(Terrain)!;
		this._terrain.updateMesh();

		Engine.world.makeEntity(
			new ControlledOrbitCamera([20, 0, 20])
		);
	}

	on_end() {
		// SUPER IMPORTANT.
		this._terrain = null;
	}

	quit_to_menu() {
		Engine.app.requestSwitchTo('Menu');
	}

	new_world() {

	}

	save_world() {

	}

	load_world() {

	}

	open_terrain_tools() {
		this._mode = EditorMode.TerrainHeight;
	}

	open_entity_tools() {
		this._mode = EditorMode.EntityPlace;
	}

	open_tables() {
		this._mode = EditorMode.Editing;
	}

	open_world_settings() {
		this._mode = EditorMode.Editing;
	}
}