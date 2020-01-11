import { EReduxActionTypes } from "../action_types"
import { ISensorData } from "./types"

export default function(state: ISensorData[] = [], action: any) {
  switch (action.type) {
    case EReduxActionTypes.UPDATE_SENSOR_DATA:
      // action.data: ISensorData
      let found = false;
      console.log(action.data);
      for (let i = 0; i < state.length; ++i) {
        if (action.data.idx == state[i].idx) {
          state[i] = action.data;
          found = true;
          break;
        }
      }
      if (!found) {
        state.push(action.data);
      }
      console.log(state[0].rawImg);
      return state;
    case EReduxActionTypes.RESET_SENSOR_STORAGE:
      return [];
    default:
      return state;
  }
}
