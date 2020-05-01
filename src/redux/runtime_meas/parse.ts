import { IRuntimeMeasFrame, IRuntimeMeas } from './reducer'
import { CapnpOutput_Frame } from '../../com/frame_v1.capnp';


export function praseRuntimeMeasFrameData(capnpData: CapnpOutput_Frame) : IRuntimeMeasFrame {
  let measFrame: IRuntimeMeasFrame = {
    meas: [],
    frameStart: capnpData.getFrameStart().toNumber(),
    timestamp: capnpData.getTimestamp().toNumber(),
    plannedFrameLength: capnpData.getPlannedFrameLength(),
  }
  capnpData.getRuntimeMeas().forEach( (val) => {
    let meas: IRuntimeMeas = {
      name: val.getName(),
      start: val.getStart().toNumber(),
      duration: val.getDuration(),
    }
    measFrame.meas.push(meas);
  })
  return measFrame;
}
