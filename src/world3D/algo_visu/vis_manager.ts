// Access store and give to the different visus,
// also holds references to the current image and babylon js environment to pass to the visus
import { Scene } from 'babylonjs'
import { IReduxWorld } from '../../redux/world/types'
import { store } from '../../redux/store'
import { IAlgoVis3D } from './ivis'
import { SemsegObstacleVis } from './cam/semseg_obstacle_vis'
import { SemsegLaneMarkingVis } from './cam/semseg_lane_marking_vis'
import { TrackVis } from './cam/track_vis'


interface IVisuMetaData {
  vis: IAlgoVis3D;
  active: boolean;
}

export class VisManager {
  private vis3D: { [key: string]: IVisuMetaData } = {};

  constructor(private scene: Scene) {
    const vis = store.getState().vis;
    this.vis3D["point_cloud_obstacle"] = {vis: new SemsegObstacleVis(this.scene), active: vis.showPointCloudObstacle};
    this.vis3D["point_cloud_lane"] = {vis: new SemsegLaneMarkingVis(this.scene), active: vis.showPointCloudLane};
    this.vis3D["tracks"] = {vis: new TrackVis(this.scene), active: true};

    store.subscribe(() => {
      const vis = store.getState().vis;
      this.vis3D["point_cloud_obstacle"].active = vis.showPointCloudObstacle;
      this.vis3D["point_cloud_lane"].active = vis.showPointCloudLane;
    });
  }

  public update(worldData: IReduxWorld) {
    for (let key in this.vis3D) {
      if (this.vis3D[key].active)
      {
        this.vis3D[key].vis.update(worldData);
      }
      else
      {
        this.vis3D[key].vis.reset();
      }
    }
  }
};
