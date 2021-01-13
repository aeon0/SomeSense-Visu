import { IReduxWorld } from '../../redux/world/types'
import { CameraSensor } from '../sensors/camera_sensor'


// Will be updated for each camera sensor each frame
export abstract class IAlgoVis2D {
  // Will be updated when visu is active and 2D view active, will not updated when 3D view is active
  abstract update(worldData: IReduxWorld, camSensor: CameraSensor): void;
  // Will be called whenever visu is switched off or on switching from 2D -> 3D view
  abstract reset(): void;
}

// Will be updated for each camera sensor each frame
export abstract class IAlgoVis3DCam {
  // Will be updated when visu is active (will not turn of when 2D view is active since projecting on 2D image is still valid)
  abstract update(worldData: IReduxWorld, camSensor: CameraSensor): void;
  // Will be called whenever visu is switched off
  abstract reset(): void;
}

// Will be updated once each frame
export abstract class IAlgoVis3DWorld {
  // Will be updated when visu is active (will not turn of when 2D view is active since projecting on 2D image is still valid)
  abstract update(worldData: IReduxWorld): void;
  // Will be called whenever visu is switched off
  abstract reset(): void;
}
