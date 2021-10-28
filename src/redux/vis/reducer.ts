import { EReduxActionTypes } from "../action_types"


export interface IReduxVis {
  showPointCloudObstacle: boolean;
  showPointCloudLane: boolean;
}

const initialState: IReduxVis = {
  showPointCloudObstacle: true,
  showPointCloudLane: true,
}

export default function(state: IReduxVis = initialState, action: any) {
  let newState = { ...state };

  switch (action.type) {
    case EReduxActionTypes.SET_SHOW_POINTCLOUD_OBSTACLE:
        newState.showPointCloudObstacle = action.val;
        return newState;
    case EReduxActionTypes.SET_SHOW_POINTCLOUD_LANE:
      newState.showPointCloudLane = action.val;
      return newState;
    default:
      return state;
  }
}
