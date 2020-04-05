import { EReduxActionTypes } from "../action_types"


export interface IReduxConnection {
  connected: boolean;
  connecting: boolean;
}

const initialState: IReduxConnection = {
  connected: false,
  connecting: false
}

export default function(state: IReduxConnection = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.CONNECTING:
      return { connected: false, connecting: true };
    case EReduxActionTypes.CONNECTED:
      return { connected: true, connecting: false };
    case EReduxActionTypes.DISCONNECTED:
      return { connected: false, connecting: false };
    default:
      return state;
  }
}
