import { Scene, Color3, Vector3, LinesMesh, MeshBuilder } from 'babylonjs'
import { IAlgoVis2D } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { CameraSensor } from '../../sensors/camera_sensor'


export class OpticalFlowVis extends IAlgoVis2D {
  private meshTracks: LinesMesh[] = [];

  constructor(private scene: Scene) {
    super();
  }

  public reset() {
    // Remove all previous drawings
    this.meshTracks.forEach( line => {
      line.dispose();
    });
  }

  // Flow tracks are shown in the camera plane at x,y,1 with 0,0 being optical axis of camera.
  // In case there are multiple cameras, only the active cam should be visualized.
  // Currently only cam sensor is expected and drawn.
  public update(camSensor: CameraSensor, worldData: IReduxWorld) {
    this.reset();

    if (worldData.camSensors.length > 1) {
      // Note: When there are mutliple cameras views only the camera that is active should be drawn
      //       For now just expect one cam sensor. In case multiple are supported there needs to be some mapping camSensor -> flowTracks[]
      console.log("WARNING: Currently only one cam sensor can be visualized");
      return;
    }

    const focalLength = worldData.camSensors[0].focalLength;
    const principalPoint = worldData.camSensors[0].principalPoint;
    let i = 0;
    worldData.camSensors[0].opticalFlow.flowTracks.forEach( track => {
      // if (i > 0) {
      //   return;
      // }
      // const start = camSensor.calcImgToWorld(track.start);
      // start.z -= 0.2;
      // start.y -= 0.2;
      // const end = camSensor.calcImgToWorld(track.end);

      // // Maybe try line system...

      // const lineMesh = MeshBuilder.CreateLines("test", {points: [start, end]}, this.scene);
      // lineMesh.color = new Color3(0.2, 0.2, 0.9);
      // lineMesh.renderingGroupId = 2;
      // // const startMesh = MeshBuilder.Create

      // this.meshTracks.push(lineMesh);

      // i++;
    });
  }
}
