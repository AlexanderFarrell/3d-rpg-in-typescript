import { Engine } from "engine";
import { Stage } from "engine/app/stage";
import { Ocean } from "engine/components/ocean";
import { OrbitCamera } from "engine/components/orbit_camera";
import { Terrain } from "engine/components/terrain";
import { diamondSquare } from "engine/procedural/array2d_procedural";
import { Color } from "engine/visual/color";
import { Texture } from "engine/visual/texture";
import { TreeTexture } from "../assets/asset_map";
import { Location } from "engine/components/location";
import { Random } from "engine/util/random";
import { Billboard } from "engine/components/billboard";
import { PhysicsBody } from "engine/components/physics_body";

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

		let oceanEntity = Engine.world.makeEntity(
			new Ocean()
		);
		let ocean = oceanEntity.get(Ocean)!;

		// First a texture for them all
		let texture = Texture.fromURL(TreeTexture)
		for (let i = 0; i < 400; i++) {
			// Find a spot for each tree
			let location = new Location();
			location.position = [Random.next(0, 256), 0, Random.next(0, 256)];
			location.scale = [Random.next(1.2, 2.7), Random.next(3.3, 5.7), 1]
			location.Y = terrain.get_height_bilinear(location.X, location.Z);
			if (location.Y < ocean.level) {
				// Don't make trees below water
				continue;
			}

			// Create that tree
			Engine.world.makeEntity(
				location,
				new Billboard(texture),
				new PhysicsBody({
					kind: 'cylinder',
					halfHeight: 2.5,
					radius: 0.9
				}, 'static')
			)
		}

		// Make an orbiting camera
		let orbitEntity = Engine.world.makeEntity(
			new OrbitCamera([128, 10, 128])
		);
		let orbitCamera = orbitEntity.get(OrbitCamera)!;

		orbitCamera.focalPoint[1] = terrain.get_height_bilinear(
			orbitCamera.focalPoint[0],
			orbitCamera.focalPoint[2]
		)

		orbitCamera.speed = 3;
		orbitCamera.distance = 20;
		orbitCamera.lift = 20;


		let ui = Engine.ui.UiContainer;
		ui.innerHTML = `
			<div id="main_menu">
				<h1>3D RPG in TypeScript</h1>
				<button name="new">New Game</button>
				<button name="continue">Continue</button>
				<button name="settings">Settings</button>
				<button name="editor">Editor</button>
				<button name="quit">Quit</button>
			</div>
		`

		let newButton = ui.querySelector('[name="new"]')!;
		let continueButton = ui.querySelector('[name="continue"]')!;
		let settingsButton = ui.querySelector('[name="settings"]')!;
		let editorButton = ui.querySelector('[name="editor"]')!;
		let quitButton = ui.querySelector('[name="quit"]')!;

		newButton.addEventListener('click', () => {
			Engine.app.requestSwitchTo('Gameplay');
		})

		editorButton.addEventListener('click', () => {
			Engine.app.requestSwitchTo('Editor');
		})

		quitButton.addEventListener('click', () => {
			Engine.app.quit();
		})

		if (Engine.app.platform == "web") {
			editorButton.remove();
			quitButton.remove();
		}

	}

	on_end() {
		Engine.ui.clear();
	}
}