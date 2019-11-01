import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4, FloatArray } from 'babylonjs'
import { ITrack } from '../../redux/world/types'


export class Track {
  private data: ITrack;
  private mesh: Mesh = null;
  private material: StandardMaterial = null;

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

  public update(data: ITrack) {
    this.data = data;

    // Update object according to data
    if (!this.mesh) {
      // Init Mesh
      console.log("INIT");
      this.mesh = new Mesh("custom", this.scene);
      console.log(this.data.depth);
      this.mesh = MeshBuilder.CreateBox(
        "box",
        {height: this.data.height, width: this.data.width, depth: Math.max(0.1, this.data.depth)},
        this.scene);
      this.mesh.position = this.data.position;
      /*
      this.mesh.edgesWidth = 4.0;
      this.mesh.edgesColor = new Color4(1, 1, 1, 1);
      this.mesh.enableEdgesRendering(.9999);
      this.mesh.material = this.material;
      this.mesh.renderingGroupId = 2;
      */
    }
    else {
      // Update Mesh
      // this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.getVertexPosition());
      console.log("update");
      this.mesh.position = this.data.position;
    }
  }
}
