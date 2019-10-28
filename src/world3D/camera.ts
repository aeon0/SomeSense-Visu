import { store } from '../redux/store'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { Scene, ArcRotateCamera, Viewport, Vector3, Quaternion } from 'babylonjs'
import { CameraSensor } from './sensors/camera_sensor'
// import { createGlobalStyle } from 'styled-components'


export class Camera {
  private camera: ArcRotateCamera;
  private canvas: any;
  private perspective: EPerspectiveTypes;

  constructor(private scene: Scene, private camSensor: CameraSensor) {
    this.canvas = scene.getEngine().getRenderingCanvas();
    this.perspective = store.getState().perspective.type;
  }

  public init() {
    this.camera = new ArcRotateCamera("main_cam", 1, 1, 50, new Vector3(0.0, 0.0, 0.0), this.scene);
    this.scene.activeCamera = this.camera;
    this.camera.attachControl(this.canvas, true);

    this.updatePerspective();

    window.addEventListener("wheel", e => {
      if(this.perspective == EPerspectiveTypes.IMAGE_2D) {
        const zoomFactor = Math.max(Math.min(this.camera.viewport.width + (e.deltaY / 550), 3), 0.1);
        // console.log(e.pageX + ", " + e.pageY);
        // this.camera.viewport = new Viewport((1 - zoomFactor) / 2, (1 - zoomFactor) / 2, zoomFactor, zoomFactor);
      }
    });
   }

  public getCamDirection(): Vector3 {
    return this.camera.getTarget().subtract(this.camera.position).normalize();
  }

  public updatePerspective(): void {
    switch(this.perspective) {
      case EPerspectiveTypes.IMAGE_2D:
        // TODO: Can not handle roll angles...
        this.camera.upperAlphaLimit = -Math.PI/2 - this.camSensor.getYaw();
        this.camera.lowerAlphaLimit = -Math.PI/2 - this.camSensor.getYaw();
        this.camera.upperBetaLimit = Math.PI/2 - this.camSensor.getPitch();
        this.camera.lowerBetaLimit = Math.PI/2 - this.camSensor.getPitch();
        this.camera.lowerRadiusLimit = 0.1;
        this.camera.upperRadiusLimit = 10;
        this.camera.panningAxis = new Vector3(0, 0, 0);
        this.camera.target = this.camSensor.getPosition().add(this.camSensor.getDirection());
        this.camera.position = this.camSensor.getPosition();
        console.log(this.camera.target);
        break;
      default: // EPerspectiveTypes.FREE_3D
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
  }

  public update(): void {
    const storedPerspective = store.getState().perspective.type;
    if(storedPerspective !== this.perspective) {
      this.perspective = storedPerspective;
      this.updatePerspective();
    }
  }
}
