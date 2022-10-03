import { Engine, Scene, Vector3 }from 'babylonjs'
import { Lights } from '../../../util/babylon/lights'
import { Camera } from '../../../util/babylon/camera'
import { EgoVehicle } from '../../../util/babylon/ego_vehicle'
import { showAxis, showGrid } from '../../../util/babylon/debug_mesh'
import { store } from '../../../redux/store'
import { VisManager } from './vis_manager'
import { ViewAction, setCamFrustum } from '../state'
import { CameraSensor } from '../../../util/camera_sensor'
import { Frame } from '../../../com/interface/proto/frame'


export class World {
  public engine: Engine;
  public scene: Scene;
  public camera: Camera;
  public lights: Lights;
  public egoVehicle: EgoVehicle;
  private timestamp: number;
  private visManager: VisManager;
  private currentView = ViewAction.FREE;

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

    showAxis(4, this.scene);
    showGrid(this.scene);
  }

  public handleViewAction(data: Frame) {
    // Check if we might want to update the view based on user interaction
    const view = store.getState().envTab.camView;
    if (view !== this.currentView) {
      console.log("Update Camera View to: " + view);
      if (view == ViewAction.EGO_FRONT) {
        const calib = data.camSensors[0].calib;
        const cam = new CameraSensor(data.camSensors[0].key, calib);
        const newPos = new Vector3(calib.x, calib.y, calib.z);
        this.camera.camera.position = newPos;
        let target = newPos.add(cam.getDirection());
        this.camera.camera.target = target;

        // Also disable frustum and ego
        this.egoVehicle.mesh.setEnabled(false);
        let f = this.visManager.vis3D["cam_furstum"].instance as any;
        if (f.frustum) f.frustum.setEnabled(false);
      }
      else {
        if (view == ViewAction.FREE) {
          this.camera.init();
        }
        else if (view == ViewAction.TOP) {
          this.camera.camera.position = new Vector3(70, 0, 117);
          this.camera.camera.target = new Vector3(70, 0, 0);
        }
        else if (view == ViewAction.SIDE_LEFT) {
          this.camera.camera.position = new Vector3(45, -70, 3);
          this.camera.camera.target = new Vector3(45, -70, 3);
        }

        // Enable some mesh again
        this.egoVehicle.mesh.setEnabled(true);
        let f = this.visManager.vis3D["cam_furstum"].instance as any;
        if (f.frustum) f.frustum.setEnabled(true);
      }
      this.currentView = view;
    }
  }

  public run(): void {
    this.engine.runRenderLoop(() => {
      const data = store.getState().frame.data;
      if (data) {
        this.timestamp = data.absTs;
        this.visManager.update(data);
        this.handleViewAction(data);
      }
      this.scene.render();
      // console.log(this.engine.getFps().toFixed());
    });
  }
}
