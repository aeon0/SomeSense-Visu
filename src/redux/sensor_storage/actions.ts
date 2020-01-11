import { EReduxActionTypes } from "../action_types"
import { ISensorData } from "./types"


export function updateSensorStorage(data: ISensorData) {
  return {
    type: EReduxActionTypes.UPDATE_SENSOR_DATA,
    data
  }
}

export function resetSensorStorage() {
  return {
    type: EReduxActionTypes.RESET_SENSOR_STORAGE,
  }
}
