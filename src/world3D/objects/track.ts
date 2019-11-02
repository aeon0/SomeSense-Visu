import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4, FloatArray } from 'babylonjs'
import { ITrack } from '../../redux/world/types'


export class Track {
  private data: ITrack;
  private mesh: Mesh = null;
  private material: StandardMaterial = null;
  static readonly MESH_NAME_PLANE = "track_plane";
  static readonly MESH_NAME_BOX = "track_box";

  constructor(private scene: Scene) {
    this.material = new StandardMaterial("track_material", this.scene);
    this.material.alpha = 0.3;
  }

  public reset() {
    if(this.mesh) {
      this.mesh.dispose();
      this.material.dispose();
      this.mesh.setEnabled(false);
    }
  }

  private calcBottomLeft() : Vector3 {
    return new Vector3(
      this.data.position.x - (this.data.width * 0.5),
      this.data.position.y,
      this.data.position.z
    );
  }
  private calcTopLeft() : Vector3 {
    return new Vector3(
      this.data.position.x - (this.data.width * 0.5),
      this.data.position.y + this.data.height,
      this.data.position.z
    );
  }
  private calcTopRight() : Vector3 {
    return new Vector3(
      this.data.position.x + (this.data.width * 0.5),
      this.data.position.y + this.data.height,
      this.data.position.z
    );
  }
  private calcBottomRight() : Vector3 {
    return new Vector3(
      this.data.position.x + (this.data.width * 0.5),
      this.data.position.y,
      this.data.position.z
    );
  }

  private getVertexPosition() : FloatArray {
    return [
      ...this.calcBottomLeft().asArray(),
      ...this.calcBottomRight().asArray(),
      ...this.calcTopRight().asArray(),
      ...this.calcTopLeft().asArray(),
    ]
  }

  private didShapeChange() {
    // Check if we have a ground plane now and should have a box or vice versa
    return this.mesh.name == Track.MESH_NAME_BOX && this.data.depth <= 0.1 ||
           this.mesh.name == Track.MESH_NAME_PLANE && this.data.depth > 0.1;
  }

  private init() {
    if (this.mesh) {
      this.reset();
    }
    this.mesh = new Mesh("custom", this.scene);
    if (this.data.depth > 0.1) {
      const dimensions = {height: this.data.height, width: this.data.width, depth: Math.max(0.1, this.data.depth)};
      this.mesh = MeshBuilder.CreateBox(Track.MESH_NAME_BOX, dimensions, this.scene);
    }
    else {
      const dimensions = {height: this.data.height, width: this.data.width};
      this.mesh = MeshBuilder.CreatePlane(Track.MESH_NAME_PLANE, dimensions, this.scene);
    }
    this.mesh.position = this.data.position;
    this.mesh.edgesWidth = 4.0;
    this.mesh.edgesColor = new Color4(1, 1, 1, 1);
    this.mesh.enableEdgesRendering(.9999);
    this.mesh.material = this.material;
    this.mesh.renderingGroupId = 2;
  }

  public update(data: ITrack) {
    this.data = data;

    // Update object according to data
    if (!this.mesh || this.didShapeChange()) {
      this.init();
    }
    else {
      // Update Mesh
      // this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.getVertexPosition());
      this.mesh.position = this.data.position;
    }
  }
}
