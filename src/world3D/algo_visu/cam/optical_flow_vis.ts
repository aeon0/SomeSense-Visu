import { Scene, Color3, LinesMesh, MeshBuilder } from 'babylonjs'
import { IAlgoVis2D } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { CameraSensor } from '../../sensors/camera_sensor'


export class OpticalFlowVis extends IAlgoVis2D {
  private lineSys: LinesMesh;

  constructor(private scene: Scene) {
    super();
  }

  public reset() {
    // Remove all previous drawings
    if (this.lineSys) {
      this.lineSys.dispose();
    }
  }

  public update(camSensor: CameraSensor, worldData: IReduxWorld) {
    this.reset();

    for (let i = 0; i < worldData.camSensors.length; i++) {
      if (camSensor.getKey() == worldData.camSensors[i].key) {
        let flowLines: any = [];
        worldData.camSensors[i].opticalFlow.flowTracks.forEach( track => {
          const start = camSensor.calcImgToWorld(track.start);
          const end = camSensor.calcImgToWorld(track.end);

          flowLines.push([start, end]);
        });

        this.lineSys = MeshBuilder.CreateLineSystem("optical_flow_lines", {lines: flowLines, updatable: false}, this.scene);
        this.lineSys.color = new Color3(0, 0, 1);
        this.lineSys.renderingGroupId = 2;
      }
    }
  }
}
