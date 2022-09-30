import { createAction, createReducer } from '@reduxjs/toolkit'
import { RecMeta } from '../com/interface/proto/recmeta'


const initialState: RecMeta = {
  isPlaying: false,
  recLength: 0,
  isRec: false
}

export const setRecMeta = createAction<RecMeta>('recMeta/set')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setRecMeta, (_, action) => {
      return action.payload;
    })
    .addDefaultCase((state, _) => state)
});
