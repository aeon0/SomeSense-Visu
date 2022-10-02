import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { reducer as connectionReducer, IReduxConnection } from './connection'
import { reducer as frameReducer, IReduxFrame } from './frame'
import { reducer as settingsReducer, IReduxSettings } from './settings'
import { reducer as recMetaReducer } from './recmeta'
import { RecMeta } from '../com/interface/proto/recmeta'
// Redux store from tabs
import { reducer as envTabRedcuer, IReduxEnvTab } from '../tabs/env/state'


export interface AppState {
  connection: IReduxConnection,
  frame: IReduxFrame,
  settings: IReduxSettings,
  recMeta: RecMeta,
  envTab: IReduxEnvTab,
}

const reducer = combineReducers<AppState>({
  connection: connectionReducer,
  frame: frameReducer,
  settings: settingsReducer,
  recMeta: recMetaReducer,
  envTab: envTabRedcuer,
});

// const debugMiddleware = store => next => action => {
//   console.log(store.getState());
//   console.log(action.type);
//   next(action);
// }

const stateSyncMiddleware = [createStateSyncMiddleware({
  whitelist: ['frame/setData']
})];
export const store = configureStore({
  reducer,
  middleware: stateSyncMiddleware,
});
initMessageListener(store);

