import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import {FlyCamera} from "engine/components/flycamera"
import Tree from "./assets/tree.png";
import {Random} from "engine/util/random";
import {Terrain} from "engine/components/terrain";

Engine.start(() => {
	let texture = Texture.fromURL(Tree)

	for (let i = 0; i < 40; i++) {
		let location = new Location();
		location.position = [Random.next(0, 64), 0, Random.next(0, 64)];
		location.scale = [Random.next(1.2, 2.7), Random.next(3.3, 5.7), 1]

		Engine.world.makeEntity(
			location,
			new Billboard(texture)
		)
	}

	Engine.world.makeEntity(
		new FlyCamera()
	);

	let terrainEntity = Engine.world.makeEntity(
		new Terrain(16, 16)
	);

	let terrain = terrainEntity.get(Terrain)!;
	terrain.cellSize = 4.0;
	for (let y = 0; y < terrain.heightMap.height; y++) {
		for (let x = 0; x < terrain.heightMap.width; x++) {
			terrain.heightMap.set(Random.next(0.0, 1.2), x, y);
		}
	}
	terrain.updateMesh();

	Engine.visual.camera.location.position = [32, 2, 10]
});
