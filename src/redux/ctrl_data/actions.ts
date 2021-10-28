import { EReduxActionTypes } from "../action_types"
import { ICtrlData } from "./reducer"


export function updateCtrlData(ctrlData: ICtrlData) {
  return {
    type: EReduxActionTypes.UPDATE_CTRL_DATA,
    ctrlData
  }
}

export function resetCtrlData() {
  return {
    type: EReduxActionTypes.RESET_CTRL_DATA,
  }
}
