import { Scene, StandardMaterial, Mesh, Vector3, VertexData, Matrix, Color4 } from 'babylonjs'
import { CameraSensor } from './camera_sensor'


export class CameraFrustum {
  private frustum : Mesh;
  constructor(private scene: Scene, private camSensor: CameraSensor) {}

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
    this.frustum.dispose();
    this.init();
  }

  public init() {
    let transparentMaterial = new StandardMaterial("transparent_object", this.scene);
    transparentMaterial.alpha = 0.03;
    transparentMaterial.backFaceCulling = false;

    const depth: number = 140;
    const delta_y = Math.tan(this.camSensor.getFovHorizontal() / 2) * depth;
    const delta_z = Math.tan(this.camSensor.getFovVertical() / 2) * depth;

    this.frustum = new Mesh("cam_furstum", this.scene);

    let vertexData = new VertexData();
    vertexData.positions = [
      0, 0, 0,
      depth,  delta_y,  delta_z, // top-left
      depth,  delta_y, -delta_z, // top-right
      depth, -delta_y,  delta_z, // bottom-left
      depth, -delta_y, -delta_z, // bottom-right
    ];
    vertexData = vertexData.transform(this.camSensor.getCamToWorld());

    vertexData.indices = [
      0, 1, 2, // top
      0, 3, 4, // bottom
      0, 2, 4, // right
      0, 1, 3, // left
    ];
    vertexData.normals = [];
    VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
    vertexData.applyToMesh(this.frustum);
    this.frustum.material  = transparentMaterial;
    this.frustum.edgesColor = new Color4(1, 1, 1, 1);
    this.frustum.enableEdgesRendering(.9999);

    // rotate frustum
    this.frustum.setPivotPoint(this.camSensor.getPosition());
  }
}
