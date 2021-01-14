import { Scene, Color3, LinesMesh, MeshBuilder } from 'babylonjs'
import { IAlgoVis2D } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { CameraSensor } from '../../sensors/camera_sensor'


export class SemsegMaskVis extends IAlgoVis2D {
  private lineSys: LinesMesh;

  constructor(private scene: Scene) {
    super();
  }


  public reset() {

  }

  public update(worldData: IReduxWorld, camSensor: CameraSensor) {
    this.reset();
    // TODO: Visualize the semseg mask
  }
}
