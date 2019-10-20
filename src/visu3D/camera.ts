import * as BABYLON from 'babylonjs';

export class Camera {
  //Members
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private canvas: any;
  private radius: number = 55;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.canvas = scene.getEngine().getRenderingCanvas();
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
}