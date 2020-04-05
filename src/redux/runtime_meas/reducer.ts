import { EReduxActionTypes } from "../action_types"


// The actuall data is stored in the world store since each runtime meas belongs to a specific frame
export interface IRuntimeMeas {
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
