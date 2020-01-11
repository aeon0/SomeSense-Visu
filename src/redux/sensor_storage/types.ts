export interface ISensorData {
  idx: number;
  ts: number;
  width: number;
  height: number;
  channels: number;
  rawImg: Uint8Array;
  imageBase64: string;
}
