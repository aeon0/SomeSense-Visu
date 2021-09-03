import { IReduxWorld } from '../../redux/world/types'

export abstract class IAlgoVis3D {
  abstract update(worldData: IReduxWorld): void;
  abstract reset(): void;
}
