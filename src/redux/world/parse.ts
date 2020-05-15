import { Vector3, Vector2 } from 'babylonjs'
import { IReduxWorld, ICamSensor, ITrack, IOpticalFlow } from './types'
import { CapnpOutput_Frame } from '../../com/frame_v1.capnp'


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
    const imgWidth = val.getImg().getWidth();
    const imgHeight = val.getImg().getHeight();
    var imageData = new ImageData(imgWidth, imgHeight);
    var rawImgPayload = val.getImg().getData().toUint8Array();
    var x = 0;
    var z = 0;
    while (x < rawImgPayload.length) {
      const b = rawImgPayload[x++];
      const g = rawImgPayload[x++];
      const r = rawImgPayload[x++];
      imageData.data[z++] = r; // red
      imageData.data[z++] = g; // green
      imageData.data[z++] = b; // blue
      imageData.data[z++] = 0xFF; // alpha
    }
    
    // Parse optical flow
    let flowData: IOpticalFlow = {
      endTs: val.getOpticalFlow().getEndTs().toNumber(),
      deltaTime: val.getOpticalFlow().getDeltaTime(),
      flowTracks: [],
    };
    val.getOpticalFlow().getFlowTracks().forEach( flowTrack => {
      flowData.flowTracks.push({
        start: new Vector2(flowTrack.getStartX(), flowTrack.getStartY()),
        end: new Vector2(flowTrack.getStartX(), flowTrack.getStartY()),
      });
    });

    // Fill camera interface
    let camSensor: ICamSensor = {
      timestamp: val.getTimestamp().toNumber(),
      key: val.getKey(),
      position: new Vector3(val.getX(), val.getY(), val.getZ()), // autosar coordiante system
      rotation: new Vector3(val.getRoll(), val.getPitch(), val.getYaw()), // autosar coordiante system
      idx: val.getIdx(),
      fovVertical: val.getFovVertical(),
      fovHorizontal: val.getFovHorizontal(),
      imageData: imageData,
      focalLength: new Vector2(val.getFocalLengthX(), val.getFocalLengthY()),
      principalPoint: new Vector2(val.getPrincipalPointX(), val.getPrincipalPointY()),
      opticalFlow: flowData
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
