import { ICtrlData } from './reducer'
import { CapnpOutput_Frame } from '../../com/frame.capnp';


export function parseCtrlData(capnpData: CapnpOutput_Frame) : ICtrlData {
  let ctrlData: ICtrlData = {
    isARecording: false,
    recLength: 0,
    isPlaying: false,
    isStoring: false,
  }
  return ctrlData;
}
