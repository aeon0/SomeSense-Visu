import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4 } from 'babylonjs'
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
  }

  public update(perspective: EPerspectiveTypes) {
    // Hide ego vehicle in case of 2D view
    if(perspective == EPerspectiveTypes.IMAGE_2D) {
      this.mesh.setEnabled(false);
    }
    else {
      this.mesh.setEnabled(true);
    }
  }
}