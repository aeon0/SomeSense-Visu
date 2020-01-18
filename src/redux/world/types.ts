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

export interface ICamSensor {
  idx: number;
  key: string;
  position: Vector3; // [m]
  rotation: Vector3; // pitch, yaw, roll in [rad]
  fovHorizontal: number, // [rad]
  fovVertical: number, // [rad]
  imageBase64: string,
  timestamp: number, // timestamp of the image [us]
}

export interface IRuntimeMeas {
  name: string;
  start: number; // start timestamp in [us]
  duration: number; // duration in [ms]
}

export interface IReduxWorld {
  tracks: ITrack[];
  camSensors: ICamSensor[];
  runtimeMeas: IRuntimeMeas[];
  timestamp: number; // timestamp of the algo [us]
  frameCount: number;


  isRecording: boolean; // true if provided data is based on a recording
  // only filled if isRecording is true
  recLength: number; // [us]
  isPlaying: boolean; // indicates if currently a recording is playing (false if pausing)
  isStoring: boolean; // indicates if currently the frames a stored
}
