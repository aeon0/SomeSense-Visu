import { EReduxActionTypes } from "../action_types"


export function setConnecting(connecting: boolean = true) {
  return {
    type: EReduxActionTypes.SET_CONNECTING,
    connecting
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

export function setServer(host: string, port: number) {
  return {
    type: EReduxActionTypes.SET_HOST,
    host,
    port,
  }
}
