import { Scene, Color3, LinesMesh, MeshBuilder } from 'babylonjs'
import { IAlgoVis3DCam } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { CameraSensor } from '../../sensors/camera_sensor'


export class SemsegPointCloudVis extends IAlgoVis3DCam {
  private lineSys: LinesMesh;

  constructor(private scene: Scene) {
    super();
  }


  public reset() {
  }

  public update(worldData: IReduxWorld, camSensor: CameraSensor) {
    this.reset();
  }
}
