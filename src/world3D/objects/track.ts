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
  private didShapeChange = () : boolean => (this.mesh &&
                                            ((this.is3DBox() && this.data.depth <= 0.1) || 
                                             (this.is2DPlane() && this.data.depth > 0.1)));

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
    this.mesh.position = new Vector3(
      this.data.position.x,
      this.data.position.y + this.data.height * 0.5,
      this.data.position.z);
    this.mesh.edgesWidth = 4.0;
    this.mesh.edgesColor = new Color4(1, 1, 1, 1);
    this.mesh.enableEdgesRendering(.9999);
    this.mesh.material = this.material;
    this.mesh.renderingGroupId = 2;
  }

  public update(data: ITrack) {
    this.data = data;

    // Update object according to data
    const shapeChanged = this.didShapeChange();
    if (!this.mesh || shapeChanged) {
      this.init();
    }
    else {
      // Set mesh to no rotation to make scaling and positioning easier
      this.mesh.rotation = new Vector3(0, 0, 0);

      // Position is expected in center of object, but this.data.position is center(x, z) bottom(y)
      this.mesh.position = new Vector3(
        this.data.position.x,
        this.data.position.y + this.data.height * 0.5,
        this.data.position.z);

      // Its damn complicated to get the correct bounding box size information...
      const currentSize: Vector3 = this.mesh.getBoundingInfo().boundingBox.extendSize.scale(2);
      const scaleWidth = data.width / currentSize.x;
      const scaleHeight = data.height / currentSize.y;
      // This is a bit tricky. We dont want to scale depth in case it is a 2D Plane and in case the shape has changed
      const scaleDepth = (this.is2DPlane() || shapeChanged) ? 1 : data.depth / currentSize.z;
      this.mesh.setPivotPoint(this.data.position);
      this.mesh.scaling = new Vector3(scaleWidth, scaleHeight, scaleDepth);
      
      // Reaply new rotation
      this.mesh.rotation = this.data.rotation;
    }
  }
}
