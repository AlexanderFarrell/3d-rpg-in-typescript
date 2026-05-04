import mitt from "mitt"

export let EditorEvents = mitt();

export function resetEvents() {
    EditorEvents = mitt();
}