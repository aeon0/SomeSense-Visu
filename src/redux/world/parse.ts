import { Vector3 } from 'babylonjs'
import { IReduxWorld } from './types'


const toVec3 = (data: any) : Vector3 => new Vector3(data[0], data[1], data[2]);

export function parseWorldObj(worldObj: any) : IReduxWorld {
  // Convert Sensor Data
  worldObj.sensor.position = toVec3(worldObj.sensor.position);
  worldObj.sensor.rotation = toVec3(worldObj.sensor.rotation);
  worldObj.sensor.image = new Buffer(worldObj.sensor.image, 'base64');

  // Convert Objects
  for(let i = 0; i < worldObj.objects.length; ++i) {
    let obj = worldObj.objects[i];
    obj.class = Math.floor(obj.class);
    obj.position = toVec3(obj.position);
  }

  return worldObj as IReduxWorld;
}
