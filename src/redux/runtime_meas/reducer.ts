import { EReduxActionTypes } from "../action_types"
import { IRuntimeMeas } from "../world/types"


export interface IRuntimeMeasFrame {
  meas: IRuntimeMeas[],
  frameStart: number,
  timestamp: number,
  plannedFrameLength: number,
}

export interface IRuntimeMeasStore {
  data: IRuntimeMeasFrame[],
  show: boolean,
}

const initialState: IRuntimeMeasStore = {
  data: [],
  show: false,
}

export default function(state: IRuntimeMeasStore = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.SHOW_RUNTIME_MEAS:
      state.show = true;
      return state;
    case EReduxActionTypes.HIDE_RUNTIME_MEAS:
      state.show = false;
      return state;
    case EReduxActionTypes.ADD_RUNTIME_MEAS:
      // In case the user goes backwards somehow, reset the runtime meas store
      // TODO: reevaluate if the reseting is actually wanted or not after doing some actual developing with it
      const currLength = state.data.length;
      if (currLength > 0 && state.data[currLength - 1].timestamp > action.runtimeMeasFrame.timestamp) {
        state.data = [];
      }
      state.data.push(action.runtimeMeasFrame);
      if (state.data.length >= 50) {
        state.data.shift();
      }
      return state;
    default:
      return state;
  }
}
