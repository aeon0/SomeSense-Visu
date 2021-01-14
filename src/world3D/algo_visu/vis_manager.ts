// Access store and give to the different visus,
// also holds references to the current image and babylon js environment to pass to the visus
import { Scene } from 'babylonjs'
import { IReduxWorld } from '../../redux/world/types'
import { IAlgoVis2D, IAlgoVis3DCam, IAlgoVis3DWorld } from './ivis'
import { SemsegMaskVis } from './cam/semseg_mask_vis'
import { SemsegObstacleVis } from './cam/semseg_obstacle_vis'
import { SemsegLaneMarkingVis } from './cam/semseg_lane_marking_vis'
import { CameraSensor } from '../sensors/camera_sensor'
import { store } from '../../redux/store'
import { EPerspectiveTypes } from '../../redux/perspective/reducer'


// Note that "2D" means still in 3D space but everything is drawn onto a normalized plane parallel to the sensor img
export class VisManager {
  // member variable for all visus, add new visu here
  private vis2D: IAlgoVis2D[] = [];
  private vis3DCam: IAlgoVis3DCam[] = [];
  private vis3DWorld: IAlgoVis3DWorld[] = [];
  private currPerspective: EPerspectiveTypes;

  constructor(private scene: Scene) {
    // Add all the visus
    this.vis2D.push(new SemsegMaskVis(this.scene));
    this.vis3DCam.push(new SemsegObstacleVis(this.scene));
    this.vis3DCam.push(new SemsegLaneMarkingVis(this.scene));

    this.currPerspective = store.getState().perspective.type;

    store.subscribe(() => {
      var newPerspective = store.getState().perspective.type;
      if (newPerspective !== this.currPerspective) {
        this.currPerspective = newPerspective;
        // While 3D vis is also correctly projected intwo the 2D view,
        // vice versa does not make sense to show 2D vis in 3D view
        if (this.currPerspective === EPerspectiveTypes.FREE_3D) {
          this.vis2D.forEach( vis => {
            vis.reset();
          });
        }
      }
    });
  }

  public update(camSensor: CameraSensor, worldData: IReduxWorld) {
    // update all visus
    this.vis2D.forEach( vis => {
      vis.update(worldData, camSensor);
    });
    this.vis3DCam.forEach( vis => {
      vis.update(worldData, camSensor);
    });
    this.vis3DWorld.forEach( vis => {
      vis.update(worldData);
    });
  }
};

// Next, how to turn visu on off and other actions from user towards it? 
// Each "visu" which is registered should be able to turned on and off
// Next2: how to do user interactions like hover and click on visus?
// Next3: how to do 2D text onto this to show info
