import { Vector3, Vector2 } from 'babylonjs'


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

export interface IOpticalFlow {
  endTs: number; // in [us]
  deltaTime: number; // in [ms]
  flowTracks: {start: Vector2, end: Vector2}[];
}

export interface ISemseg {
  maskData: ImageData; // semseg mask
  offsetTop: number; // Offset from top compared to org image input (relative to org image) in [px]
  offsetLeft: number; // Offset from left compared to org image input (relative to org image) in [px]
  scale: number; // Scale factor of the image
  obstacles: Vector3[]; // Points in the 3D world in [m]
  laneMarkings: Vector3[]; // Points in the 3D world in [m]
  driveableBins: {startPos: Vector3, extendX: number, absExtendY: number}[]; // Drivable bins, all values in [m]
}

export interface ICamSensor {
  idx: number;
  key: string;
  position: Vector3; // [m]
  rotation: Vector3; // pitch, yaw, roll in [rad]
  fovHorizontal: number; // [rad]
  fovVertical: number; // [rad]
  imageData: ImageData;
  timestamp: number; // timestamp of the image [us]
  focalLength: Vector2; // (x, y) in pixel
  principalPoint: Vector2; // (x, y) in pixel

  opticalFlow: IOpticalFlow;
  semseg: ISemseg;
}

export interface IReduxWorld {
  camSensors: ICamSensor[];
  timestamp: number; // timestamp of the algo [us]
  frameCount: number; // current number of the frame
  frameStart: number; // timestamp of the start of the frame [us] (including pause time during recordings)
  plannedFrameLength: number; // planned length of frame in [ms]

  tracks: ITrack[];
}
