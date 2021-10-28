import { ICtrlData } from './reducer'


export function parseCtrlData(msg: any) : ICtrlData {
  let ctrlData: ICtrlData = {
    isARecording: msg["isARecording"],
    recLength: msg["recLength"],
    isPlaying: msg["isPlaying"],
  }
  return ctrlData;
}
