import { EReduxActionTypes } from "../action_types"


export function connecting() {
  return {
    type: EReduxActionTypes.CONNECTING,
  }
}

export function disconnected() {
  return {
    type: EReduxActionTypes.DISCONNECTED,
  }
}

export function connected() {
  return {
    type: EReduxActionTypes.CONNECTED,
  }
}
