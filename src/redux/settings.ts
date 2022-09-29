import { createAction, createReducer } from '@reduxjs/toolkit'


export interface IReduxSettings {
  showRuntimeMeas: boolean,
}

const initialState: IReduxSettings = {
  showRuntimeMeas: false
}

export const setShowRuntimeMeas = createAction<boolean>('settings/setShowRuntimeMeas')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setShowRuntimeMeas, (state, action) => {
      state.showRuntimeMeas = action.payload;
    })
    .addDefaultCase((state, _) => state)
});
