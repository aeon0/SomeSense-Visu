import { Engine, Scene }from 'babylonjs'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis } from './axis'
import { Image2D } from './image2d';
import { CameraFrustum } from './sensor_views/camera_frustum';


export class World {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private camera: Camera;
  private lights: Lights;
  private egoVehicle: EgoVehicle;
  private image2D: Image2D;
  private cameraFrustum: CameraFrustum;


  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    this.camera = new Camera(this.scene);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);
    // this.cameraFrustum = new CameraFrustum(this.scene);
    this.image2D = new Image2D(this.scene);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  public load(): void {
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);

    this.camera.init();
    this.lights.init();
    this.egoVehicle.init();
    // this.cameraFrustum.init();
    this.image2D.init();

    showAxis(10, this.scene);
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      this.camera.update();
      this.image2D.update();
      this.scene.render();
    });
  }
}
