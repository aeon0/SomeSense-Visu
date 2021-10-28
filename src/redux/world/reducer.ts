import { EReduxActionTypes } from "../action_types"
import { IReduxWorld } from "./types"


function world(state: IReduxWorld = null, action: any) {
  switch (action.type) {
    case EReduxActionTypes.RESET_WORLD:
      return null;
    case EReduxActionTypes.UPDATE_WORLD:
      return action.world;
    default:
      return state;
  }
}

function worldRaw(state: Uint8Array = null, action: any) {
  switch (action.type) {
    case EReduxActionTypes.RESET_WORLD:
      return null;
    case EReduxActionTypes.UPDATE_WORLD_RAW:
      return action.world;
    default:
      return state;
  }
}

export {world, worldRaw}
