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
    transparentMaterial.alpha = 0.1;
    transparentMaterial.backFaceCulling = false;

    const d: number = 60;
    const delta_x = Math.tan(this.camSensor.getFovHorizontal() / 2) * d;
    const delta_y = Math.tan(this.camSensor.getFovVertical() / 2) * d;

    this.frustum = new Mesh("custom", this.scene);

    let vertexData = new VertexData();
    vertexData.positions = [
      ...this.camSensor.getPosition().asArray(),
      this.camSensor.getPosition().x + delta_x, this.camSensor.getPosition().y + delta_y, this.camSensor.getPosition().z + d, // top-left
      this.camSensor.getPosition().x - delta_x, this.camSensor.getPosition().y + delta_y, this.camSensor.getPosition().z + d, // top-right
      this.camSensor.getPosition().x + delta_x, this.camSensor.getPosition().y - delta_y, this.camSensor.getPosition().z + d, // bottom-left
      this.camSensor.getPosition().x - delta_x, this.camSensor.getPosition().y - delta_y, this.camSensor.getPosition().z + d, // bottom-right
    ];
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
    this.frustum.addRotation(this.camSensor.getPitch(), this.camSensor.getYaw(), this.camSensor.getRoll());
  }
}
