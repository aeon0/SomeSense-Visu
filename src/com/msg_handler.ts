import * as capnp from 'capnp-ts';
// import { CapnpOutput_Frame } from './frame.capnp.js'
import { store } from '../redux/store'
// // World store
// import { IReduxWorld } from '../redux/world/types'
// import { updateWorld, resetWorld } from '../redux/world/actions'
// import { parseWorldObj } from '../redux/world/parse'
// // CtrlData store
// import { ICtrlData } from '../redux/ctrl_data/reducer'
// import { updateCtrlData, resetCtrlData } from '../redux/ctrl_data/actions'
// import { parseCtrlData } from '../redux/ctrl_data/parse'
// // RuntimeMeas store
// import { IRuntimeMeasFrame } from "../redux/runtime_meas/reducer"
// import { addRuntimeMeas, clearRuntimeMeas } from "../redux/runtime_meas/actions"
// import { praseRuntimeMeasFrameData } from "../redux/runtime_meas/parse"


export function hanldeProtobufMsg(payload: ArrayBuffer) {
  console.log(payload);
  // const reduxWorld: IReduxWorld = parseWorldObj(frameData);
  // const runtimeMeasFrame: IRuntimeMeasFrame = praseRuntimeMeasFrameData(frameData);
  // store.dispatch(updateWorld(reduxWorld));
  // store.dispatch(addRuntimeMeas(runtimeMeasFrame));
}
