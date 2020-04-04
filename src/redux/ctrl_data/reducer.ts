import { EReduxActionTypes } from "../action_types"
import { ICtrlData } from "./types"


export default function(state: ICtrlData = null, action: any) {
  switch (action.type) {
    case EReduxActionTypes.UPDATE_CTRL_DATA:
      return action.ctrlData;
    case EReduxActionTypes.RESET_CTRL_DATA:
      return null;
    default:
      return state;
  }
}
