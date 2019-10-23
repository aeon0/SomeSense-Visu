import * as BABYLON from 'babylonjs'

export class EgoVehicle {
  private scene: BABYLON.Scene;

  constructor(scene: BABYLON.Scene){
    this.scene = scene;
  }

  public init(){
    var transparentMaterial = new BABYLON.StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.3; // value of 0.3 is applied fro transparency

    const length: number = 3.5;
    const height: number = 1.5;
    var box = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 2.5, depth: length}, this.scene);
    box.position = new BABYLON.Vector3(0, (height/2), -(length/2));
    box.edgesWidth = 4.0;
    box.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
    box.enableEdgesRendering(.9999);
    box.material  = transparentMaterial;
    box.renderingGroupId = 2;

    // Test mesh
    var testBox = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 2, depth: length}, this.scene);
    testBox.position = new BABYLON.Vector3(0, (height/2), 20);
    testBox.edgesWidth = 4.0;
    testBox.edgesColor = new BABYLON.Color4(0.1, 0.3, 0.7, 1);
    testBox.enableEdgesRendering(.9999);
    testBox.material  = transparentMaterial;
    testBox.renderingGroupId = 2;

    var testBox2 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 2, depth: length}, this.scene);
    testBox2.position = new BABYLON.Vector3(7, (height/2), 35);
    testBox2.edgesWidth = 4.0;
    testBox2.edgesColor = new BABYLON.Color4(0.1, 0.3, 0.7, 1);
    testBox2.enableEdgesRendering(.9999);
    testBox2.material  = transparentMaterial;
    testBox2.renderingGroupId = 2;
    
  }
}