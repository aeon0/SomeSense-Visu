import { EReduxActionTypes } from "../action_types"
import { IReduxWorld } from "./types"


let intialState = {} as IReduxWorld;

export default function(state: IReduxWorld = intialState, action: any) {
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
