import * as fs from 'fs'
import { Vector3 } from 'babylonjs'
import { IReduxWorld } from './types'

let CURR_IMG_PATH: string = null;
const toVec3 = (data: any) : Vector3 => new Vector3(data[0], data[1], data[2]);

export function parseWorldObj(worldObj: any) : IReduxWorld {
  // Convert Sensor Data
  worldObj.sensor.position = toVec3(worldObj.sensor.position);
  worldObj.sensor.rotation = toVec3(worldObj.sensor.rotation);

  // Save Image to a tmp folder
  const dir = process.cwd() + "/tmp";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  else if(CURR_IMG_PATH) {
    fs.unlinkSync(CURR_IMG_PATH);
  }
  worldObj.sensor.imagePath = dir + "/front_cam_img_" + worldObj.timestamp + ".jpg";
  CURR_IMG_PATH = worldObj.sensor.imagePath;
  const imgBuffer = new Buffer(worldObj.sensor.image, 'base64');
  fs.writeFileSync(worldObj.sensor.imagePath, imgBuffer);
  delete worldObj.sensor.image;

  // Convert Objects
  for(let i = 0; i < worldObj.objects.length; ++i) {
    let obj = worldObj.objects[i];
    obj.class = Math.floor(obj.class);
    obj.position = toVec3(obj.position);
  }

  return worldObj as IReduxWorld;
}
