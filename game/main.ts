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
import {PhysicsBody} from "engine/components/physics_body"
import { Array2D } from "engine/util/array2d";
import { Color } from "engine/visual/color";
import {diamondSquare} from "engine/procedural/array2d_procedural"

// This is where we start the engine. The engine
// takes a function which it will run once started.
Engine.start(() => {
	// Step 2. - Create a nice terrain for our world.
	// Make the terrain
	let terrainEntity = Engine.world.makeEntity(
		new Terrain(65, 65)
	);

	let terrain = terrainEntity.get(Terrain)!;
	terrain.cellSize = 4.0;
	diamondSquare(terrain.heightMap);

	for (let y = 0; y < terrain.heightMap.height; y++) {
		for (let x = 0; x < terrain.heightMap.width; x++) {
			let height = terrain.heightMap.get(x, y)!;
			if (height > 18.0) {
				terrain.colorMap.set(new Color(0.9, 0.95, 1), x, y)
			} 
			else if (height > 8.0) {
				terrain.colorMap.set(new Color(0.7, 0.5, 0.2), x, y);
			}
			else if (height < -4.0) {
				terrain.colorMap.set(new Color(0.9, 0.9, 0.0), x, y);
			}
		}
	}

	terrain.updateMesh();

	// Step 1. - Make tons of trees

	// First a texture for them all
	let texture = Texture.fromURL(Tree)
	for (let i = 0; i < 400; i++) {
		// Find a spot for each tree
		let location = new Location();
		const terrainSize = (terrain.heightMap.width - 1) * terrain.cellSize;
		location.position = [Random.next(0, terrainSize), 0, Random.next(0, terrainSize)];
		location.scale = [Random.next(1.2, 2.7), Random.next(3.3, 5.7), 1]
		location.position[1] = terrain.getHeightAt(location.X, location.Z) ?? 0;

		// Create that tree
		Engine.world.makeEntity(
			location,
			new Billboard(texture),
			new PhysicsBody({ kind: 'cylinder', halfHeight: 2.5, radius: 0.8 }, 'static')
		)
	}

	// Step 1.5 - Add lots of melon
	let melonTexture = Texture.fromURL(Melon);
	for (let i = 0; i < 40; i++) {
		let location = new Location();
		location.position = [Random.next(0, 256), 0.5, Random.next(0, 256)];
		location.position[1] = terrain.getHeightAt(location.X, location.Z) ?? 0;

		Engine.world.makeEntity(
			location,
			new Billboard(melonTexture)
		)
	}



	// Step 3. - Be able to move around in the world
	// Make a "FlyCamera" which adds controls to the camera
	// Engine.world.makeEntity(
	// 	new FlyCamera()
	// );

	Engine.world.makeEntity(
		new Location([10, 20, 10]),
		new FirstPersonMove()
	)
	// Place the camera in a nice starting position
	Engine.visual.camera.location.position = [32, 3, 10]
});
