import { EReduxActionTypes } from "../action_types"
import { EPerspectiveTypes } from "./reducer"


export function setPerspective(type: EPerspectiveTypes) {
  return {
    type: EReduxActionTypes.SET_PERSPECTIVE,
    perspective: type
  }
}
