import { EReduxActionTypes } from "../action_types"


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
