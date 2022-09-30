import { Frame as ProtoFrame } from "./interface/proto/frame"
import { RecMeta as ProtoRecMeta } from "./interface/proto/recmeta"
import { store } from "../redux/store"
import { setData } from "../redux/frame"
import { setRecMeta } from "../redux/recmeta"
import { savePbToFile } from '../util/save_protobuf'


export function hanldeProtobufMsg(topic: string, payload: Uint8Array) {
  if (topic == "somesense_app") {
    const data = ProtoFrame.decode(payload);
    store.dispatch(setData(data));
    if (store.getState().frame.isSaving && store.getState().frame !== null) {
      savePbToFile(store.getState().frame.fileName, payload, store.getState().frame.data.absTs);
    }
  }
  else if (topic == "somesense_recmeta") {
    const data = ProtoRecMeta.decode(payload);
    store.dispatch(setRecMeta(data));
  }
  else {
    console.warn("Unkonwn topic found during handleProtobufMsg(): " + topic);
  }
}
