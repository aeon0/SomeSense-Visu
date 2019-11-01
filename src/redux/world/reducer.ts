import { EReduxActionTypes } from "../action_types"
import { IReduxWorld } from "./types"


export default function(state: IReduxWorld = null, action: any) {
  switch (action.type) {
    case EReduxActionTypes.RESET_WORLD:
      const resetState = {} as IReduxWorld;
      return resetState;
    case EReduxActionTypes.UPDATE_WORLD:
      return action.world;
    default:
      return state;
  }
}
