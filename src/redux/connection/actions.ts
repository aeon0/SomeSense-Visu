import { EReduxActionTypes } from "../action_types"


export function setConnecting() {
  return {
    type: EReduxActionTypes.CONNECTING,
  }
}

export function setDisconnected() {
  return {
    type: EReduxActionTypes.DISCONNECTED,
  }
}

export function setConnected() {
  return {
    type: EReduxActionTypes.CONNECTED,
  }
}
