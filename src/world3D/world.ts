import { Engine, Scene, Vector3 }from 'babylonjs'
import { store } from '../redux/store'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis } from './axis'
import { Image2D } from './image2d';
import { CameraFrustum } from './sensors/camera_frustum';
import { CameraSensor } from './sensors/camera_sensor';
import { ISensor } from '../redux/world/types'


export class World {
  private engine: Engine;
  private scene: Scene;
  private camera: Camera;
  private lights: Lights;
  private egoVehicle: EgoVehicle;
  private image2D: Image2D;
  private cameraFrustum: CameraFrustum;
  private timestamp: number;
  private camSensor: CameraSensor;


  constructor(private canvas: HTMLCanvasElement) {
    // default camera
    this.camSensor = new CameraSensor(
      new Vector3(0, 6, -0.5),
      new Vector3(0, 0, 0), // pitch, yaw, roll
      (1/2)*Math.PI, // 90 degree
      (1/4)*Math.PI, // 45 degree
    );

    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    this.camera = new Camera(this.scene, this.camSensor);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    this.cameraFrustum = new CameraFrustum(this.scene, this.camSensor);
    this.image2D = new Image2D(this.scene, this.camSensor);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    // Subscribe to the store to listen for changes in the world
    this.timestamp = -1;
    store.subscribe(() => {
      // Check if the frame has changed, if it has not
      const worldData = store.getState().world;
      if (worldData && this.timestamp !== worldData.timestamp) {
        this.timestamp = worldData.timestamp;
        const sensorData: ISensor = worldData.sensor;
        this.image2D.updateImage(sensorData.imagePath);
  
        // In case current cam sensor differs from received one, update
        const camSensor = new CameraSensor(
          sensorData.position,
          sensorData.rotation,
          sensorData.fovHorizontal,
          sensorData.fovVertical,
        );
        if (!camSensor.equals(this.camSensor)) {
          this.camSensor = camSensor;
          this.camera.updateCamera(camSensor);
          this.cameraFrustum.updateCamera(camSensor);
          this.image2D.updateCamera(camSensor);
        }
      }
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
      // Update scene
      const perspective = store.getState().perspective.type;
      this.egoVehicle.update(perspective);
      this.image2D.update(perspective);
      this.camera.update(perspective);

      this.scene.render();
    });
  }
}
