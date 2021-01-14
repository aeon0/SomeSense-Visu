import { Vector3, Vector2 } from 'babylonjs'
import { IReduxWorld, ICamSensor, ITrack, IOpticalFlow, ISemseg } from './types'
import { CapnpOutput_Frame } from '../../com/frame.capnp'


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

    // Parse semseg data
    const maskWidth = val.getSemseg().getMask().getWidth();
    const maskHeight = val.getSemseg().getMask().getHeight();
    var maskData = new ImageData(maskWidth, maskHeight);
    rawImgPayload = val.getSemseg().getMask().getData().toUint8Array();
    x = 0;
    z = 0;
    while (x < rawImgPayload.length) {
      const b = rawImgPayload[x++];
      const g = rawImgPayload[x++];
      const r = rawImgPayload[x++];
      maskData.data[z++] = r; // red
      maskData.data[z++] = g; // green
      maskData.data[z++] = b; // blue
      maskData.data[z++] = 0xFF; // alpha
    }
    let semseg: ISemseg = {
      maskData: maskData,
      offsetTop: val.getSemseg().getOffsetTop(),
      offsetLeft: val.getSemseg().getOffsetLeft(),
      scale: val.getSemseg().getScale(),
      obstacles: [],
      laneMarkings: [],
      driveableBins: [],
    };
    val.getSemseg().getObstacles().forEach(point => semseg.obstacles.push(new Vector3(point.getX(), point.getY(), point.getZ())));
    val.getSemseg().getLaneMarkings().forEach(point => semseg.laneMarkings.push(new Vector3(point.getX(), point.getY(), point.getZ())));
    val.getSemseg().getDriveableBins().forEach(drivableBin => semseg.driveableBins.push({
      startPos: new Vector3(drivableBin.getStartPos().getX(), drivableBin.getStartPos().getY(), drivableBin.getStartPos().getZ()),
      extendX: drivableBin.getExtendX(),
      absExtendY: drivableBin.getAbsExtendY(),
    }));

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
      semseg: semseg,
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
