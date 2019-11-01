import { StandardMaterial, Texture, Color3, Scene, Mesh, MeshBuilder, Vector3 } from 'babylonjs'
import { AdvancedDynamicTexture, Image } from 'babylonjs-gui'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { CameraSensor } from './sensors/camera_sensor'


export class Image2D {
  private perspective: EPerspectiveTypes = null;
  private image3DMesh: Mesh = null;
  private image2DGUI: Image = null;
  private dynamicTexture: AdvancedDynamicTexture = null;
  private ratio: number = 1;
  private textureMaterial: StandardMaterial = null;
  private imagePath: string = null;

  constructor(private scene: Scene, private camSensor: CameraSensor) {
    window.addEventListener("resize", () => {
      if(this.dynamicTexture !== null) {
        this.dynamicTexture.dispose();
        this.dynamicTexture =  AdvancedDynamicTexture.CreateFullscreenUI("UI");
      }
    });
  }

  public init(): void {
    // Setup the 3D Image Layer for the 2D View - confusing isn't it ;)
    this.textureMaterial = new StandardMaterial("image2D_texture", this.scene);
    this.textureMaterial.ambientColor = new Color3(10, 10, 10);
    this.textureMaterial.backFaceCulling = false;
    const width = 4 * Math.tan(this.camSensor.getFovHorizontal() * 0.5);
    const height = 4 * Math.tan(this.camSensor.getFovVertical() * 0.5);
    this.ratio = width / height;
    this.image3DMesh = MeshBuilder.CreatePlane("image2D", { width: width, height: height}, this.scene);
    this.image3DMesh.material = this.textureMaterial;
    this.image3DMesh.renderingGroupId = 1;
    this.image3DMesh.position = this.camSensor.getPosition();
    // Rotate image
    this.image3DMesh.addRotation(this.camSensor.getPitch(), this.camSensor.getYaw(), this.camSensor.getRoll());
    // Move camera 1 forward
    this.image3DMesh.position = this.image3DMesh.position.add(this.camSensor.getDirection().normalize().multiply(new Vector3(2, 2, 2)));

    // Setup the 2D GUI texture for the 3D View
    this.dynamicTexture =  AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.image2DGUI = new Image();
    this.dynamicTexture.addControl(this.image2DGUI);
  }

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
    this.image3DMesh.dispose();
    this.textureMaterial.dispose();
    this.init();
  }

  public updateImage(imagePath: string) {
    this.imagePath = imagePath;
  }

  public update(perspective: EPerspectiveTypes): void {
    if(perspective !== this.perspective) {
      this.perspective = perspective;
      if (this.perspective !== EPerspectiveTypes.IMAGE_2D) {
        this.image3DMesh.setEnabled(false);
        this.dynamicTexture =  AdvancedDynamicTexture.CreateFullscreenUI("UI");
      }
      else {
        this.dynamicTexture.dispose();
        this.image3DMesh.setEnabled(true);
      }
    }

    // Update Texture
    if(this.image3DMesh.isEnabled()) {
      this.textureMaterial.ambientTexture = new Texture(this.imagePath, this.scene);
      this.image3DMesh.material.dispose();
      this.image3DMesh.material = this.textureMaterial;
    }
    else {
      this.image2DGUI = new Image("gui_cam_view", this.imagePath);
      // Place image in bottom right corner
      const canvasWidth = this.scene.getEngine().getRenderingCanvas().width;
      const canvasHeight = this.scene.getEngine().getRenderingCanvas().height;
      const imgOffset = canvasHeight * 0.02;
      this.image2DGUI.heightInPixels = canvasWidth * 0.11;
      this.image2DGUI.widthInPixels = this.image2DGUI.heightInPixels * this.ratio;
      this.image2DGUI.left = canvasWidth * 0.5 - this.image2DGUI.widthInPixels * 0.5 - imgOffset;
      this.image2DGUI.top = canvasHeight * 0.5 - this.image2DGUI.heightInPixels * 0.5 - imgOffset;

      this.dynamicTexture.addControl(this.image2DGUI);
    }
  }
}
