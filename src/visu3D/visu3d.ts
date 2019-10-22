import { Engine, Scene }from 'babylonjs';
import { Lights } from './lights';
import { Camera } from './camera';
import { EgoVehicle } from './ego_vehicle';


export class Visu3D {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private camera: Camera;
  private lights: Lights;
  private egoVehicle: EgoVehicle;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    this.camera = new Camera(this.scene);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  public load(): void {
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);

    this.camera.init();
    this.lights.init();
    this.egoVehicle.init();
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      this.camera.update();
      this.scene.render();
    });
  }
}
