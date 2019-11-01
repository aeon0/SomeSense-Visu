import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { Scene, ArcRotateCamera, Viewport, Vector3, FlyCamera } from 'babylonjs'
import { CameraSensor } from './sensors/camera_sensor'


export class Camera {
  private camera: ArcRotateCamera | FlyCamera;
  private canvas: any;
  private perspective: EPerspectiveTypes;

  constructor(private scene: Scene, private camSensor: CameraSensor) {
    this.canvas = scene.getEngine().getRenderingCanvas();
    this.perspective = null;
  }

  public init() {
    this.updatePerspective();

    window.addEventListener("wheel", e => {
      if(this.perspective == EPerspectiveTypes.IMAGE_2D) {
        const zoomFactor = Math.max(Math.min(this.camera.viewport.width + (e.deltaY / 550), 3), 0.1);
        // console.log(e.pageX + ", " + e.pageY);
        // TODO: when zooming larger it does not show objects outside of camera frustum. Think about how to handle this
        //       e.g. increase field of view?
        this.camera.viewport = new Viewport((1 - zoomFactor) / 2, (1 - zoomFactor) / 2, zoomFactor, zoomFactor);
      }
    });
  }

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
  }

  public updatePerspective(): void {
    switch(this.perspective) {
      case EPerspectiveTypes.IMAGE_2D:
        const pos = this.camSensor.getPosition();
        const target = this.camSensor.getPosition().add(this.camSensor.getDirection().normalize());
        this.camera = new FlyCamera("2D_cam", pos, this.scene);
        this.camera.setTarget(target);
        this.camera.applyGravity = false;
        this.camera.bankedTurn = false
        this.camera.bankedTurnMultiplier = 0
        this.camera.rotationQuaternion = this.camSensor.getQuaternion()
        break;
      default: // EPerspectiveTypes.FREE_3D
        this.camera = new ArcRotateCamera("3D_cam", 1, 1, 50, new Vector3(0.0, 0.0, 0.0), this.scene);
        this.camera.viewport = new Viewport(0, 0, 1, 1);
        this.camera.upperAlphaLimit = null;
        this.camera.lowerAlphaLimit = null;
        this.camera.upperBetaLimit = Math.PI/2;
        this.camera.lowerBetaLimit = 0;
        this.camera.wheelPrecision = 4;
        this.camera.lowerRadiusLimit = 0.1;
        this.camera.upperRadiusLimit = 250;
        this.camera.panningAxis = new Vector3(1, 0, 1);
        this.camera.target = new Vector3(0, 0, 0);
        this.camera.position = new Vector3(30, 20, -30);
        break;
    }

    this.scene.activeCamera = this.camera;
    this.camera.attachControl(this.canvas, true);
  }

  public update(perspective: EPerspectiveTypes): void {
    if(perspective !== this.perspective) {
      this.perspective = perspective;
      this.updatePerspective();
    }
  }
}
