import { EReduxActionTypes } from "../action_types"


export interface IReduxConnection {
  connected: boolean;
  connecting: boolean;
  waitForData: boolean;
  host: string; 
}

const initialState: IReduxConnection = {
  connected: false,
  connecting: false,
  waitForData: false,
  host: "",
}

export default function(state: IReduxConnection = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.CONNECTING:
      return { connected: false, connecting: true, waitForData: false, host: state.host };
    case EReduxActionTypes.CONNECTED:
      return { connected: true, connecting: false, waitForData: false, host: state.host };
    case EReduxActionTypes.DISCONNECTED:
      return { connected: false, connecting: false, waitForData: false, host: state.host };
    case EReduxActionTypes.WAIT_FOR_DATA:
      return { connected: true, connecting: false, waitForData: true, host: state.host };
    case EReduxActionTypes.SET_HOST:
      return {
        connected: state.connected,
        connecting: state.connecting,
        waitForData: state.waitForData,
        host: action.host
      }
    default:
      return state;
  }
}
