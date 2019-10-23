import { Scene, StandardMaterial, Mesh, Vector3, VertexData, Matrix, Color4 } from 'babylonjs'

export class CameraFrustum {
  private scene: Scene;
  private position: Vector3; // origin position of the camera
  private fovHorizontal: number; // angle in rad
  private fovVertical: number; // angle in rad
  private pitch: number; // angle in rad (rotation around x-axis)
  private yaw: number; // angle in rad (rotation around y-axis)
  private roll: number; // angle in rad (rotation around z-axis)

  constructor(scene: Scene, position: Vector3, fovHorizontal: number, fovVertical: number,
              pitch: number = 0, yaw: number = 0, roll: number = 0 ){
    this.scene = scene;
    this.position = position;
    this.fovHorizontal = fovHorizontal;
    this.fovVertical = fovVertical;
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }

  public init(){
    let transparentMaterial = new StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.1;
    transparentMaterial.backFaceCulling = false;

    const d: number = 60;
    const delta_x = Math.tan(this.fovHorizontal / 2) * d;
    const delta_y = Math.tan(this.fovVertical / 2) * d;

    let frustum = new Mesh("custom", this.scene);

    let vertexData = new VertexData();
    vertexData.positions = [
      ...this.position.asArray(),
      this.position.x + delta_x, this.position.y + delta_y, this.position.z + d, // top-left
      this.position.x - delta_x, this.position.y + delta_y, this.position.z + d, // top-right
      this.position.x + delta_x, this.position.y - delta_y, this.position.z + d, // bottom-left
      this.position.x - delta_x, this.position.y - delta_y, this.position.z + d, // bottom-right
    ];
    vertexData.indices = [
      0, 1, 2, // top
      0, 3, 4, // bottom
      0, 2, 4, // right
      0, 1, 3, // left
    ];
    vertexData.normals = [];
    VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
    vertexData.applyToMesh(frustum);
    frustum.material  = transparentMaterial;
    frustum.edgesColor = new Color4(1, 1, 1, 1);
    frustum.enableEdgesRendering(.9999);

    // rotate frustum
    frustum.setPivotPoint(this.position);
    frustum.addRotation(this.pitch, this.yaw, this.roll);
  }
}