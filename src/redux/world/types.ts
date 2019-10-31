import { Vector3 } from 'babylonjs'


export enum ECLass {
  CAR = "CAR",
  PED = "PED",
  BICYCLE = "BICYCLE",
  MOTORBIKE = "MOTORBIKE",
  UNKOWN = "UNKOWN"
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

export interface ISensorData {
  position: Vector3; // [m]
  rotation: Vector3; // pitch, yaw, roll in [rad]
  fovHorizontal: number, // [rad]
  fovVertical: number, // [rad]
  image: any,
}

export interface IReduxWorld {
  objects: IObject[];
  sensor: ISensorData;
  timestamp: number;
}
