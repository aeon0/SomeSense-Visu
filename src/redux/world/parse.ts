import { Vector3 } from 'babylonjs'
import { IReduxWorld, ICamSensor, ITrack } from './types'
import { CapnpOutput_Frame } from '../../com/frame.capnp'
import { encode, RawImageData } from 'jpeg-js'


export function parseWorldObj(frame: CapnpOutput_Frame) : IReduxWorld {
  let worldObj: IReduxWorld = {
    timestamp: frame.getTimestamp().toNumber(),
    frameStart: frame.getFrameStart().toNumber(),
    plannedFrameLength: frame.getPlannedFrameLength(),
    frameCount: frame.getFrameCount().toNumber(),
    camSensors: [],
    tracks: [],
  };

  // Convert Sensor Data
  frame.getCamSensors().forEach( (val) => {
    // Make base64 image from buffer
    const imgWidth = val.getImg().getWidth();
    const imgHeight = val.getImg().getHeight();
    var rawImgData = Buffer.alloc( imgWidth * imgHeight * 4);
    var rawImgPayload = val.getImg().getData().toUint8Array();
    var i = 0;
    var x = 0;
    while (i < rawImgData.length) {
      const b = rawImgPayload[x++];
      const g = rawImgPayload[x++];
      const r = rawImgPayload[x++];
      rawImgData[i++] = r; // red
      rawImgData[i++] = g; // green
      rawImgData[i++] = b; // blue
      rawImgData[i++] = 0xFF; // alpha - ignored in JPEGs
    }
    const rawBuf: RawImageData<Buffer> = { width: imgWidth, height: imgHeight, data: rawImgData };
    const jpgImg = encode(rawBuf, 50);
    const imageBase64: string = 'data:image/jpeg;base64,' + jpgImg.data.toString('base64');

    // Fill camera interface
    let camSensor: ICamSensor = {
      timestamp: val.getTimestamp().toNumber(),
      key: val.getKey(),
      position: new Vector3(val.getX(), val.getY(), val.getZ()),
      rotation: new Vector3(val.getYaw(), val.getYaw(), val.getRoll()),
      idx: val.getIdx(),
      fovVertical: val.getFovVertical(),
      fovHorizontal: val.getFovHorizontal(),
      imageBase64: imageBase64
    };
    worldObj.camSensors.push(camSensor);
  });

  // Convert tracks
  frame.getTracks().forEach( (val) => {
    let track: ITrack = {
      class: val.getObjClass(),
      depth: val.getLength(),
      height: val.getHeight(),
      width: val.getWidth(),
      ttc: -1,
      trackId: val.getTrackId(),
      position: new Vector3(val.getX(), val.getY(), val.getZ()),
      rotation: new Vector3(val.getYaw(), val.getPitch(), val.getRoll())
    };
    worldObj.tracks.push(track);
  });

  return worldObj;
}
