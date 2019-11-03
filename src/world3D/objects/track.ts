import { Scene, Mesh, MeshBuilder, StandardMaterial, Vector3, Color4, FloatArray } from 'babylonjs'
import { ITrack } from '../../redux/world/types'


// Tracks are displayed either with rectangluar 2D-Planes (no depth information) or with 3D-boxes
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

  private is2DPlane = () : boolean => this.mesh.name == Track.MESH_NAME_PLANE;
  private is3DBox = () : boolean => this.mesh.name == Track.MESH_NAME_BOX;
  private didShapeChange = () : boolean => ((this.is3DBox() && this.data.depth <= 0.1) || 
                                            (this.is2DPlane() && this.data.depth > 0.1));

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
      this.mesh.position = this.data.position;
      this.mesh.rotation = this.data.rotation;
    }
  }
}
