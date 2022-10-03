import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxEnvTab {
  showObstacles: boolean;
  showLane: boolean;
  showCamFrustum;
}

const initialState: IReduxEnvTab = {
  showObstacles: true,
  showLane: true,
  showCamFrustum: true,
}

export const setEnvObstacleVis = createAction<boolean>('envTab/setEnvObstacleVis');
export const setEnvLaneVis = createAction<boolean>('envTab/setEnvLaneVis');
export const setCamFrustum = createAction<boolean>('envTab/setCamFrustum');

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
    .addDefaultCase((state, _) => state)
});
