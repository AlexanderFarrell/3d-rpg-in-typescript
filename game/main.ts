import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import { Color } from "engine/visual/color";
import {FlyCamera} from "engine/components/flycamera"
import Tree from "./assets/tree.png";
import {Random} from "engine/util/random";

Engine.start(() => {
	let texture = Texture.FromURL(Tree)

	// Make a ton of billboards

	for (let i = 0; i < 20; i++) {
		let location = new Location();
		location.Position = [Random.Next(-10, 10), 0, Random.Next(-10, 10)];
		location.Scale = [Random.Next(1.2, 2.7), Random.Next(3.3, 5.7), 1]
		
		Engine.World.MakeEntity(
			location,
			new Billboard(texture)
		)
	}

	Engine.World.MakeEntity(
		new FlyCamera()
	)
});