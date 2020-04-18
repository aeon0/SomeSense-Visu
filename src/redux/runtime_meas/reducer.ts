import { EReduxActionTypes } from "../action_types"


export interface IRuntimeMeas {
  name: string;
  start: number; // start timestamp in [us]
  duration: number; // duration in [ms]
}

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
    case EReduxActionTypes.CLEAR_RUNTIME_MEAS:
      return initialState;
    case EReduxActionTypes.ADD_RUNTIME_MEAS:
      // In case the user goes backwards somehow, reset the runtime meas store
      // TODO: actually not 100% convinced reseting here is the way to go. Might have a usecase to keep the meas around
      const currLength = state.data.length;
      if (currLength > 0 && state.data[currLength - 1].timestamp > action.runtimeMeasFrame.timestamp) {
        state.data = [];
      }
      state.data.push(action.runtimeMeasFrame);
      // Max 30 runtime measurements, otherwise it will be too much data
      if (state.data.length >= 30) {
        state.data.shift();
      }
      return state;
    default:
      return state;
  }
}
