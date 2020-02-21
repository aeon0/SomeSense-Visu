export interface ICtrlData {
  isStoring: boolean; // indicates if currently the frames are stored

  isARecording: boolean; // true if provided data is based on a recording
  recLength: number; // length of recording in [us] (ony filled if isARecording is true)
  isPlaying: boolean; // indicates if currently a recording is playing, false if pausing (only filled if isARecording is true)
}
