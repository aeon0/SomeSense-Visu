import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { Scene, ArcRotateCamera, Viewport, Vector3, FlyCamera, Engine } from 'babylonjs'
import { CameraSensor } from './sensors/camera_sensor'


export class Camera {
  private camera: ArcRotateCamera | FlyCamera;
  private canvas: any;
  private perspective: EPerspectiveTypes = null;
  private ratioDiffFactor: number = 1;

  constructor(private scene: Scene, private engine: Engine, private camSensor: CameraSensor) {
    this.canvas = scene.getEngine().getRenderingCanvas();
  }

  public init() {
    this.updatePerspective();

    window.addEventListener("wheel", e => {
      if(this.perspective == EPerspectiveTypes.IMAGE_2D) {
        // console.log(e.pageX + ", " + e.pageY);
        const zoomFactor = Math.max(Math.min(this.camera.viewport.width + (-e.deltaY / 550), 3), 0.1);
        this.adjustZoomFactor(zoomFactor);
      }
    });
  }

  private adjustZoomFactor(zoomFactor: number): void {
    const ratioDiffOffset = zoomFactor * (1 - 1 / this.ratioDiffFactor);
    this.camera.viewport = new Viewport(
      (1 - zoomFactor) / 2,
      ((1 - zoomFactor) + ratioDiffOffset) / 2,
      zoomFactor,
      zoomFactor * (1 / this.ratioDiffFactor)
    );
  }

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
    this.updatePerspective();
  }

  private updatePerspective(): void {
    switch(this.perspective) {
      case EPerspectiveTypes.IMAGE_2D:
        const pos = this.camSensor.calcCamToWorld(new Vector3(0, 0, 0));
        const target = this.camSensor.calcCamToWorld(new Vector3(1, 0, 0));
        this.camera = new FlyCamera("2D_cam", pos, this.scene);
        this.camera.upVector = this.camSensor.getUpVector();
        this.camera.setTarget(target);
        this.camera.applyGravity = false;
        this.camera.bankedTurn = false;
        this.camera.bankedTurnMultiplier = 0;
        this.camera.inputs.clear(); // no inputs needed, should be locked
        this.camera.fov = this.camSensor.getFovHorizontal();
        this.ratioDiffFactor = this.camSensor.getRatio() / this.engine.getAspectRatio(this.camera);
        this.adjustZoomFactor(1.05);
        break;
      default: // EPerspectiveTypes.FREE_3D
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
        break;
    }

    this.camera.minZ = 0.01;
    this.scene.activeCamera = this.camera;
    this.camera.attachControl(this.canvas, true);
  }

  public update(perspective: EPerspectiveTypes): void {
    if (perspective !== this.perspective) {
      this.perspective = perspective;
      this.updatePerspective();
    }
  }
}
