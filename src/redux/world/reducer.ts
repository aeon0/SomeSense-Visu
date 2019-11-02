import { EReduxActionTypes } from "../action_types"
import { IReduxWorld } from "./types"


export default function(state: IReduxWorld = null, action: any) {
  switch (action.type) {
    case EReduxActionTypes.RESET_WORLD:
      return null;
    case EReduxActionTypes.UPDATE_WORLD:
      return action.world;
    default:
      return state;
  }
}
