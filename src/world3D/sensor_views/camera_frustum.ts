import { Scene, StandardMaterial, Mesh, Vector3, VertexData } from 'babylonjs'

export class CameraFrustum {
  private scene: Scene;
  private position: Vector3; // origin position of the camera
  private viewDir: Vector3;
  private fovHorizontal: number; // angle in rad
  private fovVertical: number; // angle in rad

  constructor(scene: Scene, position: Vector3, viewDir: Vector3, fovHorizontal: number, fovVertical: number){
    this.scene = scene;
    this.position = position;
    this.viewDir = viewDir;
    this.fovHorizontal = fovHorizontal;
    this.fovVertical = fovVertical;
  }

  public init(){
    let transparentMaterial = new StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.07; // value of 0.3 is applied fro transparency

    let frustum = new Mesh("custom", this.scene);
    let vertexData = new VertexData();
    vertexData.positions = [
      0, 0, 0,
      2, 0, 2,
      -2, 0, 2,
    ];
    vertexData.indices = [0, 1, 2];
    vertexData.normals = [];
    VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
    vertexData.applyToMesh(frustum);
    frustum.material  = transparentMaterial;
  }
}