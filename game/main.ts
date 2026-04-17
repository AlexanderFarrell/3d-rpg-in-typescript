import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import { Color } from "engine/visual/color";

Engine.start(() => {
	Engine.World.MakeEntity(
		new Location([10, 0, 10]),
		new Billboard(Texture.FromColor(new Color(0.5, 0.8, 1.0)))
	);
});