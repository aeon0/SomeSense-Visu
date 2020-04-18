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

export function waitForData() {
  return {
    type: EReduxActionTypes.WAIT_FOR_DATA,
  }
}

export function setHost(host: string) {
  return {
    type: EReduxActionTypes.SET_HOST,
    host
  }
}
