import {Engine} from "engine";
import "./assets/style.css";
import { Stage } from "engine/app/stage";
import { MenuStage } from "./menu/menu";
import { GameplayStage } from "./gameplay/gameplay";
import { EditorStage } from "./editor/editor";

let stages: Stage[] = [
	new MenuStage(),
	new GameplayStage(),
	new EditorStage()
];

Engine.start(stages, "Editor");
