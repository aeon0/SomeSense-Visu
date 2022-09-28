import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux"
import { reducer as connectionReducer, IReduxConnection } from "./connection"
import { reducer as frameReducer, IReduxFrame } from "./frame"


export interface AppState {
  connection: IReduxConnection,
  frame: IReduxFrame,
}

const reducer = combineReducers<AppState>({
  connection: connectionReducer,
  frame: frameReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['frame/setData'],
      ignoredPaths: ['frame.data.camSensors']
  }}),
});
