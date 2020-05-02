import { EReduxActionTypes } from "../action_types"


export interface IReduxConnection {
  connected: boolean;
  connecting: boolean;
  waitForData: boolean;
  host: string;
  port: number;
}

const initialState: IReduxConnection = {
  connected: false,
  connecting: true, // try to connect right from the start
  waitForData: false,
  host: "localhost",
  port: 8999,
}

export default function(state: IReduxConnection = initialState, action: any) {
  let newState = { ...state };

  switch (action.type) {
    case EReduxActionTypes.SET_CONNECTING:
        newState.connecting = action.connecting;
        newState.waitForData = false;
        return newState;
    case EReduxActionTypes.CONNECTED:
      newState.connected = true;
      newState.waitForData = false;
      return newState;
    case EReduxActionTypes.DISCONNECTED:
      newState.connected = false;
      newState.waitForData = false;
      return newState;
    case EReduxActionTypes.WAIT_FOR_DATA:
        newState.waitForData = true;
        return newState;
    case EReduxActionTypes.SET_HOST:
      newState.host = action.host;
      newState.port = action.port
      return newState;
    default:
      return state;
  }
}
