// Access store and give to the different visus,
// also holds references to the current image and babylon js environment to pass to the visus
import { Scene } from 'babylonjs'
import { IReduxWorld } from '../../redux/world/types'
import { IAlgoVis2D, IAlgoVis3D } from './ivis'
import { SemsegMaskVis } from './cam/semseg_mask_vis'
import { SemsegObstacleVis } from './cam/semseg_obstacle_vis'
import { SemsegLaneMarkingVis } from './cam/semseg_lane_marking_vis'
import { CameraSensor } from '../sensors/camera_sensor'


export class VisManager {
  private vis2D: IAlgoVis2D[] = [];
  private vis3D: IAlgoVis3D[] = [];

  constructor(private scene: Scene) {
    // Add all the visus
    this.vis2D.push(new SemsegMaskVis(this.scene));
    this.vis3D.push(new SemsegObstacleVis(this.scene));
    this.vis3D.push(new SemsegLaneMarkingVis(this.scene));
  }

  public update(camSensor: CameraSensor, worldData: IReduxWorld) {
    this.vis2D.forEach( vis => {
      vis.update(worldData, camSensor);
    });
    this.vis3D.forEach( vis => {
      vis.update(worldData);
    });
  }
};

// Next, how to turn visu on off and other actions from user towards it? 
// Each "visu" which is registered should be able to turned on and off
// Next2: how to do user interactions like hover and click on visus?
// Next3: how to do 2D text onto this to show info
