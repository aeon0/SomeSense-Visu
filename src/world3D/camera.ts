import { Scene, ArcRotateCamera, Viewport, Vector3, Engine } from 'babylonjs'
import { CameraSensor } from './sensors/camera_sensor'


export class Camera {
  private camera: ArcRotateCamera;
  private canvas: any;

  constructor(private scene: Scene, private engine: Engine, private camSensor: CameraSensor) {
    this.canvas = scene.getEngine().getRenderingCanvas();
  }

  public init() {
    this.camera = new ArcRotateCamera("3D_cam", 1, 1, 50, new Vector3(0.0, 0.0, 0.0), this.scene);
    this.camera.upVector = new Vector3(0, 0, 1); // default is y axis
    this.camera.viewport = new Viewport(0, 0, 1, 1);
    this.camera.upperAlphaLimit = null;
    this.camera.lowerAlphaLimit = null;
    this.camera.upperBetaLimit = Math.PI * 0.5;
    this.camera.lowerBetaLimit = 0;
    this.camera.wheelPrecision = 4;
    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 250;
    this.camera.panningAxis = new Vector3(1, 0, 0);
    this.camera.target = new Vector3(10, 0, 0);
    this.camera.position = new Vector3(-30, -30, 20);

    this.camera.minZ = 0.01;
    this.scene.activeCamera = this.camera;
    this.camera.attachControl(this.canvas, true);
  }

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
  }
}
