import { StandardMaterial, Color3, Scene, Mesh, MeshBuilder, Vector3, DynamicTexture } from 'babylonjs'
import * as GUI from 'babylonjs-gui'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { CameraSensor } from './sensors/camera_sensor'


export class Image2D {
  private perspective: EPerspectiveTypes = null;
  private image3DMesh: Mesh = null;
  private image2DGUI: GUI.Image = null;
  private uiScreen: GUI.AdvancedDynamicTexture = null;
  private dynamicTexture: DynamicTexture = null;
  private ratio: number = 1;
  private textureMaterial: StandardMaterial = null;
  private imagePath: string = null;


  constructor(private scene: Scene, private camSensor: CameraSensor) {
    // Setup the 2D GUI texture for the 3D View
    this.uiScreen =  GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.image2DGUI = new GUI.Image();

    window.addEventListener("resize", () => {
      if(this.uiScreen !== null) {
        this.uiScreen.dispose();
        this.uiScreen =  GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      }
    });
  }

  public init(): void {
    // Setup the 3D Image Layer for the 2D View - confusing isn't it ;)
    this.textureMaterial = new StandardMaterial("image2D_texture", this.scene);
    this.textureMaterial.ambientColor = new Color3(10, 10, 10);
    this.textureMaterial.backFaceCulling = false;
    this.dynamicTexture = new DynamicTexture("image3DTexture", 1, this.scene, false);
    this.textureMaterial.ambientTexture = this.dynamicTexture;
    const width = 4 * Math.tan(this.camSensor.getFovHorizontal() * 0.5);
    const height = 4 * Math.tan(this.camSensor.getFovVertical() * 0.5);
    this.ratio = width / height;
    this.image3DMesh = MeshBuilder.CreatePlane("image2D", {width: width, height: height}, this.scene);
    this.image3DMesh.material = this.textureMaterial;
    this.image3DMesh.renderingGroupId = 1;
    this.image3DMesh.position = this.camSensor.getPosition();
    // Rotate image
    this.image3DMesh.addRotation(this.camSensor.getPitch(), this.camSensor.getYaw(), this.camSensor.getRoll());
    // Move camera 1 forward
    this.image3DMesh.position = this.image3DMesh.position.add(this.camSensor.getDirection().normalize().multiply(new Vector3(2, 2, 2)));
  }

  public updateCamera(camSensor: CameraSensor) {
    this.camSensor = camSensor;
    const isEnabled = this.image3DMesh.isEnabled();
    // Remove 3D Mesh
    this.image3DMesh.dispose();
    this.textureMaterial.dispose();
    this.dynamicTexture.dispose();
    // Recreate 3D Mesh
    this.init();
    this.image3DMesh.setEnabled(isEnabled);
  }

  public updateImage(imagePath: string) {
    this.imagePath = imagePath;
  }

  public update(perspective: EPerspectiveTypes): void {
    if (perspective !== this.perspective) {
      this.perspective = perspective;
      if (this.perspective !== EPerspectiveTypes.IMAGE_2D) {
        this.image3DMesh.setEnabled(false);
        this.uiScreen = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      }
      else {
        this.uiScreen.dispose();
        this.image2DGUI.dispose();
        this.image3DMesh.setEnabled(true);
      }
    }

    // Update Texture
    if (this.image3DMesh.isEnabled()) {
      if (this.imagePath && this.dynamicTexture) {
        var img = new Image();
        img.src = this.imagePath;
        img.onload = () => {
          this.dynamicTexture.scaleTo(img.width, img.height);
          this.dynamicTexture.getContext().drawImage(img, 0, 0);
          this.dynamicTexture.update();
        }
      }
    }
    else {
      // Place image in bottom right corner
      this.image2DGUI = new GUI.Image("gui_cam_view", this.imagePath);
      const canvasWidth = this.scene.getEngine().getRenderingCanvas().width;
      const canvasHeight = this.scene.getEngine().getRenderingCanvas().height;
      const imgOffset = canvasHeight * 0.02;
      this.image2DGUI.heightInPixels = canvasWidth * 0.11;
      this.image2DGUI.widthInPixels = this.image2DGUI.heightInPixels * this.ratio;
      this.image2DGUI.left = canvasWidth * 0.5 - this.image2DGUI.widthInPixels * 0.5 - imgOffset;
      this.image2DGUI.top = canvasHeight * 0.5 - this.image2DGUI.heightInPixels * 0.5 - imgOffset;

      this.uiScreen.addControl(this.image2DGUI);
    }
  }
}
