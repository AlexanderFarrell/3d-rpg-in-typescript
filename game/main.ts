import {Engine} from "engine";
import "./assets/style.css";
import { Stage } from "engine/app/stage";
import { MenuStage } from "./stages/menu";
import { GameplayStage } from "./stages/gameplay";
import { EditorStage } from "./stages/editor";

let stages: Stage[] = [
	new MenuStage(),
	new GameplayStage(),
	new EditorStage()
];

Engine.start(stages, "Menu");
