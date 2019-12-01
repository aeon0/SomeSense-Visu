import { Engine, Scene, Vector3 }from 'babylonjs'
import { store } from '../redux/store'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis, showGrid } from './debug_mesh'
import { Image2D } from './image2d'
import { CameraFrustum } from './sensors/camera_frustum'
import { CameraSensor } from './sensors/camera_sensor'
import { ISensor, IReduxWorld } from '../redux/world/types'
import { TrackManager } from './objects/track_manager'


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
  private trackManager: TrackManager;

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

    this.camera = new Camera(this.scene, this.engine, this.camSensor);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    this.cameraFrustum = new CameraFrustum(this.scene, this.camSensor);
    this.image2D = new Image2D(this.scene, this.camSensor);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    this.timestamp = -1;
    this.trackManager = new TrackManager(this.scene);
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
    showGrid(this.scene);
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      const worldData: IReduxWorld = store.getState().world;
      let imageBase64 = null;
      if (worldData) {
        imageBase64 = (' ' + worldData.sensor.imageBase64).slice(1); // force copy of image
        this.timestamp = worldData.timestamp;
        
        // In case current cam sensor differs from received one, update
        const sensorData: ISensor = worldData.sensor;
        const camSensor = new CameraSensor(
          sensorData.position,
          sensorData.rotation,
          sensorData.fovHorizontal,
          sensorData.fovVertical,
        );
        if (!camSensor.equals(this.camSensor)) {
          console.log("Update Cam Sensor...");
          this.camSensor = camSensor;
          this.cameraFrustum.updateCamera(camSensor);
          this.image2D.updateCamera(camSensor);
          this.camera.updateCamera(camSensor);
        }

        this.trackManager.update(worldData.tracks);
      }

      // Update scene
      const perspective = store.getState().perspective.type;
      this.egoVehicle.update(perspective);
      this.camera.update(perspective);
      this.image2D.update(perspective, imageBase64);

      this.scene.render();
    });
  }
}
