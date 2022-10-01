import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxEnvTab {
  showObstacles: boolean;
  showLane: boolean;
}

const initialState: IReduxEnvTab = {
  showObstacles: true,
  showLane: true,
}

export const setEnvObstacleVis = createAction<boolean>('envTab/setEnvObstacleVis');
export const setEnvLaneVis = createAction<boolean>('envTab/setEnvLaneVis');

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setEnvObstacleVis, (state, action) => {
      state.showObstacles = action.payload;
    })
    .addCase(setEnvLaneVis, (state, action) => {
      state.showLane = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
