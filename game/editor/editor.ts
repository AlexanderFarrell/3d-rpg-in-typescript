import { Engine } from "engine";
import { Stage } from "engine/app/stage";
import { EditorUIManager } from "./components/editor_ui";
import { EditorEvents, resetEvents } from "./core/events";
import { EditorProjectManager } from "./core/projects";

// A map/world editor which can be played
// by the GameplayStage
export class EditorStage extends Stage {
	name(): string {
		return "Editor";
	}
	
	on_start() {
		Engine.world.makeEntity(
			new EditorUIManager()
		);
		EditorProjectManager.setup();
	}

	on_end() {
		Engine.ui.clear();
		resetEvents();
	}
}