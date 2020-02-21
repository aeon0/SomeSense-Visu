import { EReduxActionTypes } from "../action_types"
import { ICtrlData } from "./types"


const initialState: ICtrlData = {
  isStoring: false,
  isARecording: false,
  isPlaying: false,
  recLength: 0
}

export default function(state: ICtrlData = initialState, action: any) {
  switch (action.type) {
    case EReduxActionTypes.UPDATE_CTRL_DATA:
      return action.ctrlData;
    default:
      return state;
  }
}
