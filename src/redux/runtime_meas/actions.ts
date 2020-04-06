import { EReduxActionTypes } from "../action_types"
import { IRuntimeMeasFrame } from "./reducer"


export function showRuntimeMeas() {
  return {
    type: EReduxActionTypes.SHOW_RUNTIME_MEAS,
  }
}

export function hideRuntimeMeas() {
  return {
    type: EReduxActionTypes.HIDE_RUNTIME_MEAS,
  }
}

export function addRuntimeMeas(runtimeMeasFrame: IRuntimeMeasFrame) {
  return {
    type: EReduxActionTypes.ADD_RUNTIME_MEAS,
    runtimeMeasFrame,
  }
}
