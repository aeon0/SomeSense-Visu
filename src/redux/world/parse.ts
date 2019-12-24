import * as fs from 'fs'
import { Vector3 } from 'babylonjs'
import { IReduxWorld } from './types'


const toVec3 = (data: any) : Vector3 => new Vector3(data[0], data[1], data[2]);

export function parseWorldObj(worldObj: any) : IReduxWorld {
  // Convert Sensor Data
  for (let i = 0; i < worldObj.sensors.length; ++i) {
    let sensor = worldObj.sensors[i];
    sensor.position = toVec3(sensor.position);
    sensor.rotation = toVec3(sensor.rotation);
  }
  
  // Convert tracks
  for(let i = 0; i < worldObj.tracks.length; ++i) {
    let track = worldObj.tracks[i];
    track.class = Math.floor(track.class);
    track.position = toVec3(track.position);
    track.rotation = toVec3(track.rotation);
  }

  return worldObj as IReduxWorld;
}
