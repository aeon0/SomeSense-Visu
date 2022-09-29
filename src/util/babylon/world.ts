import { Engine, Scene }from 'babylonjs'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis, showGrid } from './debug_mesh'


export class World {
  public engine: Engine;
  public scene: Scene;
  public camera: Camera;
  public lights: Lights;
  public egoVehicle: EgoVehicle;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.useRightHandedSystem = true; // autosar uses right handed system

    this.camera = new Camera(this.scene, this.engine);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  public load(): void {
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);
    this.scene.ambientColor = new BABYLON.Color3(.1, .1, .1);

    this.camera.init();
    this.lights.init();
    this.egoVehicle.init();
    // this.cameraFrustum.init();

    showAxis(4, this.scene);
    showGrid(this.scene);
  }
}
