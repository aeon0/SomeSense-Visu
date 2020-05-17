import { IReduxWorld } from '../../redux/world/types'
import { CameraSensor } from '../sensors/camera_sensor'

export abstract class IAlgoVis2D {
  abstract update(camSensor: CameraSensor, worldData: IReduxWorld): void;
  abstract reset(): void;
}

export abstract class IAlgoVis3D {
  abstract update(worldData: IReduxWorld): void;
  abstract reset(): void;
}
