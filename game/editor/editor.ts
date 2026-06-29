import { Engine } from "engine";
import { Stage } from "engine/app/stage";

// A map/world editor which can be played
// by the GameplayStage
export class EditorStage extends Stage {
	name(): string {
		return "Editor";
	}
	
	on_start() {
		let ui = Engine.ui.UiContainer;
		ui.innerHTML = `
		<div id="editor_ui">
			<button name="quit">Back to Menu</button>
			<button name="save">New</button>
			<button name="save">Load</button>
			<button name="save">Save</button>
		</div>
		`

		let quitButton = ui.querySelector<HTMLElement>('[name="quit"]');
		quitButton?.addEventListener('click', () => {
			Engine.app.requestSwitchTo('Menu');
		})
	}

	on_end() {

	}
}