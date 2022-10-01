import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxVis {
  showObstacles: boolean;
  showLane: boolean;
}

const initialState: IReduxVis = {
  showObstacles: true,
  showLane: true,
}

export const setObstacleVis = createAction<boolean>('vis/setObstacleVis');
export const setLaneVis = createAction<boolean>('vis/setLaneVis');

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setObstacleVis, (state, action) => {
      state.showObstacles = action.payload;
    })
    .addCase(setLaneVis, (state, action) => {
      state.showLane = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
