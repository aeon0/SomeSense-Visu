import { ICtrlData } from './reducer'
import { CapnpOutput_Frame } from '../../com/frame_v1.capnp';


export function parseCtrlData(capnpData: CapnpOutput_Frame) : ICtrlData {
  let ctrlData: ICtrlData = {
    isARecording: capnpData.getRecState().getIsARecording(),
    recLength: capnpData.getRecState().getRecLength().toNumber(),
    isPlaying: capnpData.getRecState().getIsPlaying(),
    isStoring: capnpData.getSaveToFileState().getIsStoring(),
  }
  return ctrlData;
}
