import { StandardMaterial, Texture, Color3, Scene, Mesh, Vector3 } from 'babylonjs'
import { store } from '../redux/store'
import { EPerspectiveTypes } from '../redux/perspective/reducer'


export class Image2D {
  private scene: Scene;
  private perspective: EPerspectiveTypes;
  private image2DLayer: Mesh;

  constructor(scene: Scene) {
    this.scene = scene;
    this.perspective = null;
    this.image2DLayer = null;
  }

  public init(): void {
    let material = new StandardMaterial("image2D_texture", this.scene);
    material.ambientTexture = new Texture("assets/example_img.jpg", this.scene);
    material.ambientColor = new Color3(10, 10, 10);
    material.backFaceCulling = true;

    this.image2DLayer = Mesh.CreateGround("image2D", 1, 0.5, 1, this.scene);
    this.image2DLayer.rotate(new Vector3(1, 0, 0), -Math.PI/2);
    this.image2DLayer.position = new Vector3(0, 0, 1);
    this.image2DLayer.material = material;
    this.image2DLayer.renderingGroupId = 1;
  }

  public update(): void {
    const storedPerspective = store.getState().perspective.type;
    if(storedPerspective !== this.perspective) {
      this.perspective = storedPerspective;
      if (this.perspective !== EPerspectiveTypes.IMAGE_2D) {
        // hide plane
      }
      else {
        // show plane
      }
    }
  }
}
