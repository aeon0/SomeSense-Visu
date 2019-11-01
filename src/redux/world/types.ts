import { Vector3 } from 'babylonjs'


export enum ECLass {
  CAR = 0,
  TRUCK,
  MOTORBIKE,
  BICYCLE,
  PED,
  UNKOWN,
  SIZE,
}

export interface IObject {
  trackId: string;
  class: ECLass;
  depth: false;
  position: Vector3; // [m]
  height: number; // [m]
  width: number; // [m]
  ttc: number; // [s]
}

export interface ISensor {
  position: Vector3; // [m]
  rotation: Vector3; // pitch, yaw, roll in [rad]
  fovHorizontal: number, // [rad]
  fovVertical: number, // [rad]
  image: any,
}

export interface IReduxWorld {
  objects: IObject[];
  sensor: ISensor;
  timestamp: number;
}
