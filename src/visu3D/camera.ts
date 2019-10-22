import * as BABYLON from 'babylonjs'
import { store } from '../redux/store'


export class Camera {
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private canvas: any;
  private radius: number = 55;
  private perspective: string;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.canvas = scene.getEngine().getRenderingCanvas();
    this.perspective = store.getState().perspective.type;
  }

  public init() {
    this.camera = new BABYLON.ArcRotateCamera("main_camera", 1, 1.4, this.radius, new BABYLON.Vector3(0.0, 0.0, 0.0), this.scene);
    this.camera.lowerRadiusLimit = 0.5;
    this.camera.upperRadiusLimit = 100;

    this.camera.attachControl(this.canvas, true);
  }

  public getCamDirection(): BABYLON.Vector3 {
    return this.camera.getTarget().subtract(this.camera.position).normalize();
  }

  public update(): void {
    const storedPerspective = store.getState().perspective.type;
    if(storedPerspective !== this.perspective) {
      this.perspective = storedPerspective;
      console.log("Update Perspective to: " + this.perspective);
    }
  }
}
