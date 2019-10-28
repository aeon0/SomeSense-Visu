import { StandardMaterial, Texture, Color3, Scene, Mesh, MeshBuilder, Vector3, Quaternion } from 'babylonjs'
import { store } from '../redux/store'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { CameraSensor } from './sensors/camera_sensor'


export class Image2D {
  private perspective: EPerspectiveTypes = null;
  private image2DLayer: Mesh = null;

  constructor(private scene: Scene, private camSensor: CameraSensor) {}

  public init(): void {
    let material = new StandardMaterial("image2D_texture", this.scene);
    material.ambientTexture = new Texture("assets/example_img.jpg", this.scene);
    material.ambientColor = new Color3(10, 10, 10);
    material.backFaceCulling = false;

    const width = 4 * Math.tan(this.camSensor.getFovHorizontal() * 0.5);
    const height = 4 * Math.tan(this.camSensor.getFovVertical() * 0.5);
    this.image2DLayer = MeshBuilder.CreatePlane("image2D", { width: width, height: height}, this.scene);
    this.image2DLayer.position = this.camSensor.getPosition();
    // Rotate image
    this.image2DLayer.addRotation(this.camSensor.getPitch(), this.camSensor.getYaw(), this.camSensor.getRoll());

    // Move camera 1 forward
    this.image2DLayer.position = this.image2DLayer.position.add(this.camSensor.getDirection().normalize().multiply(new Vector3(2, 2, 2)));

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
