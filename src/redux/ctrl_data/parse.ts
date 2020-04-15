import { ICtrlData } from './reducer'
import { CapnpOutput_CtrlData } from '../../com/frame.capnp';


export function parseCtrlData(capnpData: CapnpOutput_CtrlData) : ICtrlData {
  let ctrlData: ICtrlData = {
    isStoring: capnpData.getIsStoring(),
    isARecording: capnpData.getIsStoring(),
    isPlaying: capnpData.getIsPlaying(),
    recLength: capnpData.getRecLength().toNumber(),
  }
  return ctrlData;
}
