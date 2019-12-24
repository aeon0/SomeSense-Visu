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

export interface ITrack {
  trackId: string;
  class: ECLass;
  position: Vector3; // [m] center bottom point
  rotation: Vector3; // [rad]
  height: number; // [m]
  width: number; // [m]
  depth: number; // [m] can be 0, then it is just a 2D plane in a 3D world
  ttc: number; // [s]
}

export interface ISensor {
  position: Vector3; // [m]
  rotation: Vector3; // pitch, yaw, roll in [rad]
  fovHorizontal: number, // [rad]
  fovVertical: number, // [rad]
  imageBase64: string,
}

export interface IReduxWorld {
  tracks: ITrack[];
  sensors: ISensor[];
  timestamp: number;
}
