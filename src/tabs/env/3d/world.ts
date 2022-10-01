import { Engine, Scene }from 'babylonjs'
import { Lights } from '../../../util/babylon/lights'
import { Camera } from '../../../util/babylon/camera'
import { EgoVehicle } from '../../../util/babylon/ego_vehicle'
import { showAxis, showGrid } from '../../../util/babylon/debug_mesh'
import { store } from '../../../redux/store'
import { VisManager } from './vis_manager'


export class World {
  public engine: Engine;
  public scene: Scene;
  public camera: Camera;
  public lights: Lights;
  public egoVehicle: EgoVehicle;
  private timestamp: number;
  private visManager: VisManager;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.useRightHandedSystem = true; // autosar uses right handed system

    this.camera = new Camera(this.scene, this.engine);
    this.lights = new Lights(this.scene);
    this.egoVehicle = new EgoVehicle(this.scene);

    this.timestamp = -1;
    this.visManager = new VisManager(this.scene);

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  public load(): void {
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);
    this.scene.ambientColor = new BABYLON.Color3(.1, .1, .1);

    this.camera.init();
    this.lights.init();
    this.egoVehicle.init();
    // this.cameraFrustum.init();

    showAxis(4, this.scene);
    showGrid(this.scene);
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      const data = store.getState().frame.data;
      if (data && (data.absTs != this.timestamp)) {
        this.timestamp = data.absTs;
        this.visManager.update(data);
      }

      this.scene.render();
      // console.log(this.engine.getFps().toFixed());
    });
  }
}
