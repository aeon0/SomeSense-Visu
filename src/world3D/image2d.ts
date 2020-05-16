import { StandardMaterial, Color3, VertexData, Scene, Mesh, MeshBuilder, Vector3, DynamicTexture, Matrix } from 'babylonjs'
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
    this.textureMaterial.ambientColor = new Color3(255, 255, 255);
    this.textureMaterial.backFaceCulling = false;
    this.dynamicTexture = new DynamicTexture("image3DTexture", 1, this.scene, false);
    this.textureMaterial.ambientTexture = this.dynamicTexture;

    this.image3DMesh = new Mesh("image3d_view", this.scene);
    let vertexData = new VertexData();
    const imgDistanceFromCamera = 2; // TODO: does not like distance of 1 (maybe depth buffer of free cam not sufficient?)
    const delta_y = Math.tan(this.camSensor.getFovHorizontal() / 2) * imgDistanceFromCamera;
    const delta_z = Math.tan(this.camSensor.getFovVertical() / 2) * imgDistanceFromCamera;

    vertexData.positions = [
      imgDistanceFromCamera,  delta_y, -delta_z, // [0] bottom-left
      imgDistanceFromCamera, -delta_y, -delta_z, // [1] bottom-right
      imgDistanceFromCamera, -delta_y,  delta_z, // [2] top-right
      imgDistanceFromCamera,  delta_y,  delta_z, // [3] top-left
    ];
    vertexData = vertexData.transform(this.camSensor.getCamToWorld());

    // Check out: https://doc.babylonjs.com/how_to/custom#texture
    vertexData.indices = [ 
      0, 2, 3,
      0, 1, 2,
    ];
    vertexData.uvs = [0,0, 1,0, 1,1, 0,1];
    vertexData.normals = [];
    VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals);
    vertexData.applyToMesh(this.image3DMesh);
    this.image3DMesh.material = this.textureMaterial;
    this.image3DMesh.renderingGroupId = 1;
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
