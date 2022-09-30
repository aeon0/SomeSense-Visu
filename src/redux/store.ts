import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { reducer as connectionReducer, IReduxConnection } from './connection'
import { reducer as frameReducer, IReduxFrame } from './frame'
import { reducer as settingsReducer, IReduxSettings } from './settings'
import { reducer as recMetaReducer } from './recmeta'
import { RecMeta } from '../com/interface/proto/recmeta'


export interface AppState {
  connection: IReduxConnection,
  frame: IReduxFrame,
  settings: IReduxSettings,
  recMeta: RecMeta,
}

const reducer = combineReducers<AppState>({
  connection: connectionReducer,
  frame: frameReducer,
  settings: settingsReducer,
  recMeta: recMetaReducer,
});

export const store = configureStore({
  reducer,
  middleware: [createStateSyncMiddleware()],
});
initMessageListener(store);
