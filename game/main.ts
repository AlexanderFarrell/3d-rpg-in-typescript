import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import { Color } from "engine/visual/color";
import {FlyCamera} from "engine/components/flycamera"
import Tree from "./assets/tree.png";
import {Random} from "engine/util/random";
import {Terrain} from "engine/components/terrain";

Engine.start(() => {
	let texture = Texture.FromURL(Tree)

	// Make a ton of billboards

	for (let i = 0; i < 40; i++) {
		let location = new Location();
		location.Position = [Random.Next(0, 64), 0, Random.Next(0, 64)];
		location.Scale = [Random.Next(1.2, 2.7), Random.Next(3.3, 5.7), 1]
		
		Engine.World.MakeEntity(
			location,
			new Billboard(texture)
		)
	}

	Engine.World.MakeEntity(
		new FlyCamera()
	);

	let terrain_entity = Engine.World.MakeEntity(
		new Terrain(16, 16)
	);

	let terrain = terrain_entity.get(Terrain);
	terrain!.CellSize = 4.0;
	for (let y = 0; y < terrain!.HeightMap.Height; y++) {
		for (let x = 0; x < terrain!.HeightMap.Width; x++) {
			terrain!.HeightMap.Set(Random.Next(0.0, 1.2), x, y);
		}
	}
	terrain!.UpdateMesh()
});