import { EReduxActionTypes } from "../action_types"
import { IReduxWorld } from "./types"


export function updateWorld(world: IReduxWorld) {
  return {
    type: EReduxActionTypes.UPDATE_WORLD,
    world
  }
}

export function updateWorldRaw(world: Uint8Array) {
  return {
    type: EReduxActionTypes.UPDATE_WORLD_RAW,
    world
  }
}

export function resetWorld() {
  return {
    type: EReduxActionTypes.RESET_WORLD,
  }
}
