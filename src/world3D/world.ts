import { Engine, Scene, Vector3 }from 'babylonjs'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis } from './axis'
import { Image2D } from './image2d';
import { CameraFrustum } from './sensors/camera_frustum';
import { CameraSensor } from './sensors/camera_sensor';


export class World {
  private engine: Engine;
  private scene: Scene;
  private camera: Camera;
  private lights: Lights;
  private egoVehicle: EgoVehicle;
  private image2D: Image2D;
  private cameraFrustum: CameraFrustum;

  constructor(private canvas: HTMLCanvasElement) {
    const camSensor = new CameraSensor(
      new Vector3(0, 1.2, -0.7),
      (1/2)*Math.PI, // 90 degree
      (1/4)*Math.PI, // 45 degree
      0.0, 0.0, 0.0,
    );

    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    this.camera = new Camera(this.scene, camSensor);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    this.cameraFrustum = new CameraFrustum(this.scene, camSensor);
    this.image2D = new Image2D(this.scene, camSensor);

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
    this.cameraFrustum.init();
    this.image2D.init();

    showAxis(4, this.scene);
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      this.egoVehicle.update();
      this.image2D.update();
      this.camera.update();

      this.scene.render();
    });
  }
}
