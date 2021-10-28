import { EReduxActionTypes } from "../action_types"


export function setShowPointCloudObstacle(val: boolean = true) {
  return {
    type: EReduxActionTypes.SET_SHOW_POINTCLOUD_OBSTACLE,
    val
  }
}

export function setShowPointCloudLane(val: boolean = true) {
  return {
    type: EReduxActionTypes.SET_SHOW_POINTCLOUD_LANE,
    val
  }
}
