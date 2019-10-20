import * as BABYLON from 'babylonjs';

export class EgoVehicle {
  private scene: BABYLON.Scene;

  constructor(scene: BABYLON.Scene){
    this.scene = scene;
  }

  public init(){
    var box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 1}, this.scene);
    box.position = new BABYLON.Vector3(0, 0, 0);
  }
}