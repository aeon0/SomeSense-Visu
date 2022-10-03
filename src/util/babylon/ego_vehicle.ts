import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4 } from 'babylonjs'


export class EgoVehicle {
  public mesh: Mesh;

  constructor(private scene: Scene) {}

  public init(){
    var transparentMaterial = new StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.3; // value of 0.3 is applied for transparency

    const length: number = 2.9;
    const height: number = 1.7;
    const width: number = 1.9;
    this.mesh = MeshBuilder.CreateBox("box", {height: height, width: width, depth: length}, this.scene);
    this.mesh.rotation.y = Math.PI*0.5;
    this.mesh.rotation.z = Math.PI*0.5;
    this.mesh.position = new Vector3(-length * 0.5, 0, height * 0.5);
    this.mesh.edgesWidth = 4.0;
    this.mesh.edgesColor = new Color4(1, 1, 1, 1);
    this.mesh.enableEdgesRendering(.9999);
    this.mesh.material  = transparentMaterial;
    this.mesh.renderingGroupId = 2; // this makes sure that it the 2D image does not obscure the object
  }
}
