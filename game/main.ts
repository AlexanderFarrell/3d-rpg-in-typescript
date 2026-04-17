import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import { Color } from "engine/visual/color";
import {FlyCamera} from "engine/components/flycamera"
import Melon from "./assets/melon.png";

Engine.start(() => {
	Engine.World.MakeEntity(
		new Location([0, 0, -10]),
		// new Billboard(Texture.FromColor(new Color(0.5, 0.8, 1.0)))
		new Billboard(Texture.FromURL(Melon))
	);

	Engine.World.MakeEntity(
		new FlyCamera()
	)
});