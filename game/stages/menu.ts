import { Engine } from "engine";
import { Stage } from "engine/app/stage";
import { OrbitCamera } from "engine/components/orbit_camera";
import { Terrain } from "engine/components/terrain";
import { diamondSquare } from "engine/procedural/array2d_procedural";
import { Color } from "engine/visual/color";

// The main menu allowing the player to navigate through
// the game
export class MenuStage extends Stage {
	name(): string {
		return "Menu";
	}
	
	on_start() {
		// Step 1. - Create a nice terrain for our world.
		// Make the terrain
		let terrainEntity = Engine.world.makeEntity(
			new Terrain(65, 65)
		);

		// Make some random small hills for testing.
		let terrain = terrainEntity.get(Terrain)!;
		terrain.cellSize = 4.0;
		diamondSquare(terrain.heightMap)
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

		Engine.visual.camera.location.position = [128, 20, 128]

		// Make an orbiting camera
		let orbitEntity = Engine.world.makeEntity(
			new OrbitCamera([128, 10, 128])
		);
		let orbitCamera = orbitEntity.get(OrbitCamera)!;

		orbitCamera.focalPoint[1] = terrain.get_height_bilinear(
			orbitCamera.focalPoint[0],
			orbitCamera.focalPoint[2]
		) + 10

		orbitCamera.speed = 3;
		orbitCamera.distance = 20;
		orbitCamera.lift = 20;
	}

	on_end() {

	}
}