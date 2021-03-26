import { Engine, Scene, Vector3, Vector2 }from 'babylonjs'
import { store } from '../redux/store'
import { Lights } from './lights'
import { Camera } from './camera'
import { EgoVehicle } from './ego_vehicle'
import { showAxis, showGrid } from './debug_mesh'
import { Image2D } from './image2d'
import { CameraFrustum } from './sensors/camera_frustum'
import { CameraSensor } from './sensors/camera_sensor'
import { VisManager } from './algo_visu/vis_manager'


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
  private visManager: VisManager;

  constructor(private canvas: HTMLCanvasElement) {
    // default camera
    this.camSensor = new CameraSensor(
      "default_cam",
      new Vector3(-1.0, 0, 0.8),
      new Vector3(0, 0, 0), // roll, pitch, yaw
      (1/2)*Math.PI, // 90 degree
      (1/4)*Math.PI, // 45 degree
      new Vector2(320, 160),
      new Vector2(640, 640),
    );

    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.useRightHandedSystem = true; // autosar uses right handed system

    this.camera = new Camera(this.scene, this.engine, this.camSensor);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    this.cameraFrustum = new CameraFrustum(this.scene, this.camSensor);
    this.image2D = new Image2D(this.scene, this.camSensor);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    this.timestamp = -1;

    this.visManager = new VisManager(this.scene);
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
      const perspective = store.getState().perspective.type;
      this.egoVehicle.update(perspective);
      this.camera.update(perspective);

      const worldData = store.getState().world;
      const isARecording: boolean = store.getState().ctrlData ? store.getState().ctrlData.isARecording : false;
      // Currently just expect to only have one cam sensor and access directly with [0]
      if (worldData && worldData.camSensors.length > 0) {
        const timestampChanged = this.timestamp !== worldData.timestamp;
        this.timestamp = worldData.timestamp;
        // Update algo visus
        if (timestampChanged) {
          // In case current cam sensor differs from received one, update
          const sensorData = worldData.camSensors[0];
          const camSensor = new CameraSensor(
            sensorData.key,
            sensorData.position,
            sensorData.rotation,
            sensorData.fovHorizontal,
            sensorData.fovVertical,
            sensorData.principalPoint,
            sensorData.focalLength,
          );
          if (!camSensor.equals(this.camSensor)) {
            this.camSensor = camSensor;
            this.cameraFrustum.updateCamera(camSensor);
            this.image2D.updateCamera(camSensor);
            // this.camera.updateCamera(camSensor);
          }

          this.visManager.update(this.camSensor, worldData);

          let imageData = worldData.camSensors[0].imageData;
          this.image2D.update(perspective, imageData, isARecording);
        }
      }

      this.scene.render();
      // console.log(this.engine.getFps().toFixed());
    });
  }
}
