import {Engine} from "engine";
import "./assets/style.css";
import { Location } from "engine/components/location";
import {Billboard} from "engine/components/billboard";
import { Texture } from "engine/visual/texture";
import {FlyCamera} from "engine/components/flycamera"
import Tree from "./assets/tree.png";
import Melon from "./assets/melon.png";
import {Random} from "engine/util/random";
import {Terrain} from "engine/components/terrain";
import {FirstPersonMove} from "engine/components/first_person_move"

// This is where we start the engine. The engine 
// takes a function which it will run once started. 
Engine.start(() => {	
	// Step 1. - Make tons of trees

	// First a texture for them all
	let texture = Texture.fromURL(Tree)
	for (let i = 0; i < 40; i++) {
		// Find a spot for each tree
		let location = new Location();
		location.position = [Random.next(0, 64), 0, Random.next(0, 64)];
		location.scale = [Random.next(1.2, 2.7), Random.next(3.3, 5.7), 1]

		// Create that tree
		Engine.world.makeEntity(
			location,
			new Billboard(texture)
		)
	}

	// Step 1.5 - Add lots of melon
	let melonTexture = Texture.fromURL(Melon);
	for (let i = 0; i < 40; i++) {
		let location = new Location();
		location.position = [Random.next(0, 64), 0.5, Random.next(0, 64)];

		Engine.world.makeEntity(
			location,
			new Billboard(melonTexture)
		)
	}

	// Step 2. - Create a nice terrain for our world.
	// Make the terrain
	let terrainEntity = Engine.world.makeEntity(
		new Terrain(16, 16)
	);

	// Make some random small hills for testing.
	let terrain = terrainEntity.get(Terrain)!;
	terrain.cellSize = 4.0;
	for (let y = 0; y < terrain.heightMap.height; y++) {
		for (let x = 0; x < terrain.heightMap.width; x++) {
			terrain.heightMap.set(Random.next(0.0, 1.2), x, y);
		}
	}
	terrain.updateMesh();


	// Step 3. - Be able to move around in the world
	// Make a "FlyCamera" which adds controls to the camera
	// Engine.world.makeEntity(
	// 	new FlyCamera()
	// );

	Engine.world.makeEntity(
		new Location([0, 3, 0]),
		new FirstPersonMove()
	)
	// Place the camera in a nice starting position
	Engine.visual.camera.location.position = [32, 3, 10]
});
