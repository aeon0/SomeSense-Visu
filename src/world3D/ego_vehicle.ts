import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4 } from 'babylonjs'
import { store } from '../redux/store'
import { EPerspectiveTypes } from '../redux/perspective/reducer'


export class EgoVehicle {
  private mesh: Mesh;

  constructor(private scene: Scene) {}

  public init(){
    var transparentMaterial = new StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.3; // value of 0.3 is applied fro transparency

    const length: number = 3.5;
    const height: number = 1.5;
    this.mesh = MeshBuilder.CreateBox("box", {height: height, width: 2.5, depth: length}, this.scene);
    this.mesh.position = new Vector3(0, (height/2), -(length/2));
    this.mesh.edgesWidth = 4.0;
    this.mesh.edgesColor = new Color4(1, 1, 1, 1);
    this.mesh.enableEdgesRendering(.9999);
    this.mesh.material  = transparentMaterial;
    this.mesh.renderingGroupId = 2;

    // Test mesh
    /*
    var testBox = MeshBuilder.CreateBox("box", {height: height, width: 2, depth: length}, this.scene);
    testBox.position = new Vector3(0, (height/2), 50);
    testBox.edgesWidth = 4.0;
    testBox.edgesColor = new Color4(0.7, 0.3, 0.1, 1);
    testBox.enableEdgesRendering(.9999);
    testBox.material  = transparentMaterial;
    testBox.renderingGroupId = 2;

    var testBox2 = MeshBuilder.CreateBox("box", {height: height, width: 2, depth: length}, this.scene);
    testBox2.position = new Vector3(3, (height/2), 35);
    testBox2.edgesWidth = 4.0;
    testBox2.edgesColor = new Color4(0.7, 0.3, 0.1, 1);
    testBox2.enableEdgesRendering(.9999);
    testBox2.material = transparentMaterial;
    testBox2.renderingGroupId = 2;

    var testBox3 = MeshBuilder.CreateBox("box", {height: height, width: 2, depth: length}, this.scene);
    testBox3.position = new Vector3(-6, (height/2), 25);
    testBox3.edgesWidth = 4.0;
    testBox3.edgesColor = new Color4(0.7, 0.3, 0.1, 1);
    testBox3.enableEdgesRendering(.9999);
    testBox3.material  = transparentMaterial;
    testBox3.renderingGroupId = 2;
    testBox3.addRotation(0, 0.2, 0);
    */
  }

  public update() {
    // Hide ego vehicle in case of 2D view
    if(store.getState().perspective.type == EPerspectiveTypes.IMAGE_2D) {
      this.mesh.setEnabled(false);
    }
    else {
      this.mesh.setEnabled(true);
    }
  }
}