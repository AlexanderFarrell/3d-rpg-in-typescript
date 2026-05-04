import { Engine } from "engine";
import { Component } from "engine/world/entity";
import { createApp, type App } from "vue";
import EditorUIApp from "../ui/EditorUIApp.vue";

export class EditorUIManager extends Component {
    private app: App | null = null;
    onStart(): void {
        this.app = createApp(EditorUIApp);
        this.app.mount(Engine.ui.UiContainer);
    }

    onEnd(): void {
        this.app?.unmount();
        this.app = null;
    }
}