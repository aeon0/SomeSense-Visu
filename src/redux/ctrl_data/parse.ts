import { ICtrlData } from './reducer'


export function parseCtrlData(msg: any) : ICtrlData {
  let ctrlData: ICtrlData = {
    isARecording: msg["isARecording"],
    recLength: msg["recLength"],
    isPlaying: msg["isPlaying"],
    isStoring: msg["isStoring"]
  }
  return ctrlData;
}
