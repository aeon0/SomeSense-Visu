// Access store and give to the different visus,
// also holds references to the current image and babylon js environment to pass to the visus
import { Scene } from 'babylonjs'
import { store } from '../../../redux/store'
import { Frame } from '../../../com/interface/proto/frame'
import { IAlgoVis3D } from './ivis'
import { SemsegObstacleVis } from './semseg_obstacle_vis'
import { SemsegLaneMarkingVis } from './semseg_lane_marking_vis'


export class VisManager {
  private vis3D: { [key: string]: {instance: IAlgoVis3D, active: boolean} } = {};

  constructor(private scene: Scene) {
    const envTab = store.getState().envTab;
    this.vis3D["point_cloud_obstacle"] = {instance: new SemsegObstacleVis(this.scene), active: envTab.showObstacles};
    this.vis3D["point_cloud_lane"] = {instance: new SemsegLaneMarkingVis(this.scene), active: envTab.showLane};

    store.subscribe(() => {
      const envTab = store.getState().envTab;
      this.vis3D["point_cloud_obstacle"].active = envTab.showObstacles;
      this.vis3D["point_cloud_lane"].active = envTab.showLane;
    });
  }

  public update(worldData: Frame) {
    for (let key in this.vis3D) {
      if (this.vis3D[key].active)
      {
        this.vis3D[key].instance.update(worldData);
      }
      else
      {
        this.vis3D[key].instance.reset();
      }
    }
  }
};
