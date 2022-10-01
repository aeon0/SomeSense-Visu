import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { reducer as connectionReducer, IReduxConnection } from './connection'
import { reducer as frameReducer, IReduxFrame } from './frame'
import { reducer as settingsReducer, IReduxSettings } from './settings'
import { reducer as recMetaReducer } from './recmeta'
import { RecMeta } from '../com/interface/proto/recmeta'
import { reducer as visRedcuer, IReduxVis } from './vis'


export interface AppState {
  connection: IReduxConnection,
  frame: IReduxFrame,
  settings: IReduxSettings,
  recMeta: RecMeta,
  vis: IReduxVis,
}

const reducer = combineReducers<AppState>({
  connection: connectionReducer,
  frame: frameReducer,
  settings: settingsReducer,
  recMeta: recMetaReducer,
  vis: visRedcuer,
});

export const store = configureStore({
  reducer,
  middleware: [createStateSyncMiddleware()],
});
initMessageListener(store);
