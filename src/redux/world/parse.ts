import * as fs from 'fs'
import { Vector3 } from 'babylonjs'
import { IReduxWorld } from './types'


const toVec3 = (data: any) : Vector3 => new Vector3(data[0], data[1], data[2]);

export function parseWorldObj(worldObj: any) : IReduxWorld {
  // Convert Sensor Data
  worldObj.sensor.position = toVec3(worldObj.sensor.position);
  worldObj.sensor.rotation = toVec3(worldObj.sensor.rotation);

  // imageBase64 expects to have something like "data:image/jpeg;base64," in the beginning
  // otherwise babylon js whines, but with that prefix this ArrayBuffer conversion does not work
  // figure something out in case ArrayBuffers are needed
  // const someArrayBuffer = Uint8Array.from(atob(worldObj.sensor.imageBase64), c => c.charCodeAt(0));

  // Convert tracks
  for(let i = 0; i < worldObj.tracks.length; ++i) {
    let track = worldObj.tracks[i];
    track.class = Math.floor(track.class);
    track.position = toVec3(track.position);
    track.rotation = toVec3(track.rotation);
  }

  return worldObj as IReduxWorld;
}
