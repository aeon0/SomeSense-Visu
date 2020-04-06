import { EReduxActionTypes } from "../action_types"


export interface IReduxConnection {
  connected: boolean;
  connecting: boolean;
  waitForData: boolean;
}

const initialState: IReduxConnection = {
  connected: false,
  connecting: false,
  waitForData: false,
}

export default function(state: IReduxConnection = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.CONNECTING:
      return { connected: false, connecting: true, waitForData: false };
    case EReduxActionTypes.CONNECTED:
      return { connected: true, connecting: false, waitForData: false };
    case EReduxActionTypes.DISCONNECTED:
      return { connected: false, connecting: false, waitForData: false };
    case EReduxActionTypes.WAIT_FOR_DATA:
      return { connected: true, connecting: false, waitForData: true };
    default:
      return state;
  }
}
