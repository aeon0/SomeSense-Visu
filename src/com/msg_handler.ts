import { Frame as ProtoFrame } from "./interface/proto/frame"
import { RecMeta as ProtoRecMeta } from "./interface/proto/recmeta"
import { store } from "../redux/store"
import { setData } from "../redux/frame"
import { setRecMeta } from "../redux/recmeta"
import { savePbToFile } from '../util/save_protobuf'
import { MsgType } from "./custom/msg_types"


export async function hanldeProtobufMsg(type: string | MsgType, payload: Uint8Array) {
  if (type == "somesense_app" || type == "somesense_app_sync" || type == MsgType.PROTO_FRAME || type == MsgType.PROTO_SYNC) {
    const data = ProtoFrame.decode(payload);
    store.dispatch(setData(data));
    if (store.getState().frame.isSaving && store.getState().frame !== null) {
      savePbToFile(store.getState().frame.fileName, payload, store.getState().frame.data.absTs);
    }
  }
  else if (type == "somesense_recmeta" || type == MsgType.PROTO_RECMETA) {
    const data = ProtoRecMeta.decode(payload);
    store.dispatch(setRecMeta(data));
  }
  else {
    console.warn("Unkonwn topic found during handleProtobufMsg(): " + type);
  }
}
