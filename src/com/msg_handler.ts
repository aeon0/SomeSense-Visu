import { Frame as ProtoFrame } from "./interface/proto/frame"
import { store } from "../redux/store"
import { setData } from "../redux/frame"


export function hanldeProtobufMsg(topic: string, payload: Uint8Array) {
  if (topic == "somesense_app") {
    const data = ProtoFrame.decode(payload);
    store.dispatch(setData(data));
  }
  else {
    console.warn("Unkonwn topic found during handleProtobufMsg(): " + topic);
  }
}
