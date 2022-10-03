import { createAction, createReducer } from '@reduxjs/toolkit'


export enum ViewAction {
  FREE = 0,
  EGO_FRONT,
  SIDE_LEFT,
  TOP,
}

export interface IReduxEnvTab {
  showObstacles: boolean;
  showLane: boolean;
  showCamFrustum: boolean;
  camView: ViewAction;
}

const initialState: IReduxEnvTab = {
  // Vis Config
  showObstacles: true,
  showLane: true,
  showCamFrustum: true,
  // Camera View
  camView: ViewAction.FREE,
}

export const setEnvObstacleVis = createAction<boolean>('envTab/setEnvObstacleVis');
export const setEnvLaneVis = createAction<boolean>('envTab/setEnvLaneVis');
export const setCamFrustum = createAction<boolean>('envTab/setCamFrustum');
export const setView = createAction<ViewAction>('envTab/setViewAction');

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setEnvObstacleVis, (state, action) => {
      state.showObstacles = action.payload;
    })
    .addCase(setEnvLaneVis, (state, action) => {
      state.showLane = action.payload;
    })
    .addCase(setCamFrustum, (state, action) => {
      state.showCamFrustum = action.payload;
    })
    .addCase(setView, (state, action) => {
      state.camView = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
