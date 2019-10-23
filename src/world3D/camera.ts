import * as BABYLON from 'babylonjs'
import { store } from '../redux/store'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { Vector3 } from 'babylonjs';


export class Camera {
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private canvas: any;
  private perspective: EPerspectiveTypes;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.canvas = scene.getEngine().getRenderingCanvas();
    this.perspective = store.getState().perspective.type;
  }

  public init() {
    this.camera = new BABYLON.ArcRotateCamera("main_cam", 1, 1, 50, new BABYLON.Vector3(0.0, 0.0, 0.0), this.scene);
    this.camera.lowerRadiusLimit = 0.1;
    this.scene.activeCamera = this.camera;
    this.camera.attachControl(this.canvas, true);

    this.updatePerspective();
  }

  public getCamDirection(): BABYLON.Vector3 {
    return this.camera.getTarget().subtract(this.camera.position).normalize();
  }

  public updatePerspective(): void {
    switch(this.perspective) {
      case EPerspectiveTypes.IMAGE_2D:
        this.camera.upperRadiusLimit = 5;
        this.camera.wheelPrecision = 400;
        this.camera.upperAlphaLimit = -Math.PI/2;
        this.camera.lowerAlphaLimit = -Math.PI/2;
        this.camera.upperBetaLimit = Math.PI/2;
        this.camera.lowerBetaLimit = Math.PI/2;
        this.camera.panningAxis = new Vector3(0, 0, 0);
        this.camera.target = new Vector3(0, 1, 2);
        this.camera.position = new Vector3(0, 1, -0.5);
        break;

      default: // EPerspectiveTypes.FREE_3D
        this.camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        this.camera.wheelPrecision = 4;
        this.camera.lowerRadiusLimit = 0.1;
        this.camera.upperRadiusLimit = 100;
        this.camera.upperAlphaLimit = null;
        this.camera.lowerAlphaLimit = null;
        this.camera.upperBetaLimit = Math.PI/2;
        this.camera.lowerBetaLimit = 0;
        this.camera.panningAxis = new Vector3(1, 1, 0);
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
