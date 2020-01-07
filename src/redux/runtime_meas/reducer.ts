import { EReduxActionTypes } from "../action_types"


interface IRuntimeMeas {
  show: boolean;
}

const initialState: IRuntimeMeas = {
  show: false,
}

export default function(state: IRuntimeMeas = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.SHOW_RUNTIME_MEAS:
      return { show: true };
    case EReduxActionTypes.HIDE_RUNTIME_MEAS:
      return { show: false };
    default:
      return state;
  }
}
