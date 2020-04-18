import * as capnp from 'capnp-ts';
import { CapnpOutput_Frame } from './frame.capnp'
import { store } from '../redux/store'
// World store
import { IReduxWorld } from '../redux/world/types'
import { updateWorld, resetWorld } from '../redux/world/actions'
import { parseWorldObj } from '../redux/world/parse'
// CtrlData store
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { updateCtrlData, resetCtrlData } from '../redux/ctrl_data/actions'
import { parseCtrlData } from '../redux/ctrl_data/parse'
// RuntimeMeas store
import { IRuntimeMeasFrame } from "../redux/runtime_meas/reducer"
import { addRuntimeMeas, clearRuntimeMeas } from "../redux/runtime_meas/actions"
import { praseRuntimeMeasFrameData } from "../redux/runtime_meas/parse"


export function handleMsgData(msgType: number, payload: Uint8Array) {
  if (msgType == 1) { // Json message
    const msgStr: string = new TextDecoder("utf-8").decode(payload);
    try {
      const msg: any = JSON.parse(msgStr);
      if (msg["type"] == "server.callback") {
        // Callback for some request, search for callback in the callback list and execute
        const cbIndex: number = msg["cbIndex"];
        if (cbIndex !== -1 && cbIndex in this.callbacks) {
          this.callbacks[cbIndex](msg["data"]);
          delete this.callbacks[cbIndex];
        }
      }
      else if (msg["type"] == "server.test") {
        console.log("Got test message from server");
      }
      else {
        console.log("WARNING: Unkown server message: " + msg["type"]);
      }
    }
    catch (e) {
      console.log("WARNING: Error with json msg from Server:");
      console.log(msgStr);
      // console.log(e);
    }
  }
  else if (msgType == 2) { // Frame Data in Capnp format
    const message = new capnp.Message(payload);
    const frameData: CapnpOutput_Frame = message.getRoot(CapnpOutput_Frame);
    
    const reduxWorld: IReduxWorld = parseWorldObj(frameData);
    const runtimeMeasFrame: IRuntimeMeasFrame = praseRuntimeMeasFrameData(frameData);
    const ctrlData: ICtrlData = parseCtrlData(frameData);
    store.dispatch(updateWorld(reduxWorld));
    store.dispatch(addRuntimeMeas(runtimeMeasFrame));
    store.dispatch(updateCtrlData(ctrlData));
  }
  else {
    console.warn("Unkown message type " + msgType);
  }
}

export function resetAppState() {
  store.dispatch(resetWorld());
  store.dispatch(clearRuntimeMeas());
  store.dispatch(resetCtrlData());
}