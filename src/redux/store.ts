import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { reducer as connectionReducer, IReduxConnection } from './connection'
import { reducer as frameReducer, IReduxFrame } from './frame'
import { reducer as settingsReducer, IReduxSettings } from './settings'


export interface AppState {
  connection: IReduxConnection,
  frame: IReduxFrame,
  settings: IReduxSettings,
}

const reducer = combineReducers<AppState>({
  connection: connectionReducer,
  frame: frameReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer,
  middleware: [createStateSyncMiddleware()],
});
initMessageListener(store);
