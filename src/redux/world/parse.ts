import { Vector3, Vector2 } from 'babylonjs'
import { IReduxWorld, ICamSensor, ITrack, IOpticalFlow } from './types'
import { CapnpOutput_Frame } from '../../com/frame.capnp'


export function parseWorldObj(frame: CapnpOutput_Frame) : IReduxWorld {
  let worldObj: IReduxWorld = {
    timestamp: frame.getTimestamp().toNumber(),
    frameStart: frame.getFrameStart().toNumber(),
    plannedFrameLength: frame.getPlannedFrameLength(),
    frameCount: frame.getFrameCount().toNumber(),
    camSensors: [],
    tracks: [],
    laneMarkings: [],
    obstacles: [],
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

    // Parse semseg img. TODO: Create Image Overlay from this
    const maskWidth = val.getSemsegImg().getWidth();
    const maskHeight = val.getSemsegImg().getHeight();
    var semsegImgData = new ImageData(maskWidth, maskHeight);
    rawImgPayload = val.getSemsegImg().getData().toUint8Array();
    x = 0;
    z = 0;
    while (x < rawImgPayload.length) {
      const b = rawImgPayload[x++];
      const g = rawImgPayload[x++];
      const r = rawImgPayload[x++];
      semsegImgData.data[z++] = r; // red
      semsegImgData.data[z++] = g; // green
      semsegImgData.data[z++] = b; // blue
      semsegImgData.data[z++] = 0xFF; // alpha
    }

    // Parse depth img. TODO: Create Image Overlay from this
    const depthWidth = val.getDepthImg().getWidth();
    const depthHeight = val.getDepthImg().getHeight();
    var depthImgData = new ImageData(depthWidth, depthHeight);
    rawImgPayload = val.getDepthImg().getData().toUint8Array();
    x = 0;
    z = 0;
    while (x < rawImgPayload.length) {
      const value = rawImgPayload[x++];
      depthImgData.data[z++] = value; // red
      depthImgData.data[z++] = value; // green
      depthImgData.data[z++] = value; // blue
      depthImgData.data[z++] = 0xFF; // alpha
    }

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
      opticalFlow: flowData,
      semsegImg: semsegImgData,
      depthImg: depthImgData
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

  // Set pointcloud
  frame.getObstacles().forEach(point => worldObj.obstacles.push(new Vector3(point.getX(), point.getY(), point.getZ())));
  frame.getLaneMarkings().forEach(point => worldObj.laneMarkings.push(new Vector3(point.getX(), point.getY(), point.getZ())));

  return worldObj;
}
