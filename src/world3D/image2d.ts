import { StandardMaterial, Color3, Scene, Mesh, MeshBuilder, Vector3, DynamicTexture } from 'babylonjs'
import { EPerspectiveTypes } from '../redux/perspective/reducer'
import { CameraSensor } from './sensors/camera_sensor'


export class Image2D {
  private perspective: EPerspectiveTypes = null;
  private image3DMesh: Mesh = null;  // This is the 3D texture in the 2D View
  private dynamicTexture: DynamicTexture = null;
  private textureMaterial: StandardMaterial = null;
  private canvas2D: any = null;
  private tmpCanvas2D: any = null;

  constructor(private scene: Scene, private camSensor: CameraSensor) {
    this.canvas2D = document.getElementById("front_cam_img");
    this.tmpCanvas2D = document.getElementById("tmp_front_cam_img");
  }

  public init(): void {
    // Setup the 3D Image Layer for the 2D View - confusing isn't it ;)
    this.textureMaterial = new StandardMaterial("image2D_texture", this.scene);
    this.textureMaterial.ambientColor = new Color3(10, 10, 10);
    this.textureMaterial.backFaceCulling = false;
    this.dynamicTexture = new DynamicTexture("image3DTexture", 1, this.scene, false);
    this.textureMaterial.ambientTexture = this.dynamicTexture;
    const imgDistanceFromCamera = 1;
    const width = imgDistanceFromCamera * 2 * Math.tan(this.camSensor.getFovHorizontal() * 0.5);
    const height = imgDistanceFromCamera * 2 * Math.tan(this.camSensor.getFovVertical() * 0.5);
    this.image3DMesh = MeshBuilder.CreatePlane("image2D", {width: width, height: height}, this.scene);
    this.image3DMesh.material = this.textureMaterial;
    this.image3DMesh.renderingGroupId = 1;
    this.image3DMesh.position = this.camSensor.getPosition();
    // Rotate image
    this.image3DMesh.addRotation(this.camSensor.getPitch(), this.camSensor.getYaw(), this.camSensor.getRoll());
    // Move camera 1 forward
    this.image3DMesh.position = this.image3DMesh.position.add(this.camSensor.getDirection().normalize().multiply(new Vector3(imgDistanceFromCamera, imgDistanceFromCamera, imgDistanceFromCamera)));
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

  public update(perspective: EPerspectiveTypes, imageData: ImageData, isRecording: boolean = false): void {
    if (perspective !== this.perspective) {
      this.perspective = perspective;
      if (this.perspective !== EPerspectiveTypes.IMAGE_2D) {
        this.image3DMesh.setEnabled(false);
        this.canvas2D.style.display = "block";
      }
      else {
        this.image3DMesh.setEnabled(true);
        this.canvas2D.style.display = "none";
      }
    }

    // Update Texture
    if (this.dynamicTexture) {
      if (this.image3DMesh.isEnabled()) {
        // Dont let the name confuse you, this the 2D view
        this.dynamicTexture.scaleTo(imageData.width, imageData.height);
        var ctx = this.dynamicTexture.getContext();
        ctx.putImageData(imageData, 0, 0);
        this.dynamicTexture.update();
      }
      else {
        console.time("Draw Img");
        // Draw the full image to the tmp canvas
        this.tmpCanvas2D.height = imageData.height;
        this.tmpCanvas2D.width = imageData.width;
        var tmpCtx: CanvasRenderingContext2D = this.tmpCanvas2D.getContext("2d");
        tmpCtx.putImageData(imageData, 0, 0);

        // To resize it to the visible canvas, use drawImage() onto the new canvas
        const screenWidth = this.scene.getEngine().getRenderingCanvas().width;
        const screenHeight = this.scene.getEngine().getRenderingCanvas().height;
        const imgOffset = screenHeight * 0.02;

        const goalHeight = screenWidth * 0.125;
        const goalWidth = goalHeight * this.camSensor.getRatio();
        this.canvas2D.height = goalHeight;
        this.canvas2D.width = goalWidth;
        var ctx: CanvasRenderingContext2D = this.canvas2D.getContext("2d");
        ctx.drawImage(this.tmpCanvas2D, 0, 0, goalWidth, goalHeight);

        this.canvas2D.style.left = (screenWidth - this.canvas2D.width - imgOffset) + "px";
        if (isRecording) {
          // If its a recording we dont want it to overlap with the recording controls
          this.canvas2D.style.top = (screenHeight - this.canvas2D.height - imgOffset - 135) + "px";
        }
        else {
          this.canvas2D.style.top = (screenHeight - this.canvas2D.height - imgOffset - 70) + "px";
        }
      }
    }
  }
}
