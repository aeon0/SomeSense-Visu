import { Frame } from '../../../com/interface/proto/frame'

export abstract class IAlgoVis3D {
  abstract update(data: Frame): void;
  abstract reset(): void;
}
