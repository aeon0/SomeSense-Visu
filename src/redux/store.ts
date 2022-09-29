import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { reducer as connectionReducer, IReduxConnection } from './connection'
import { reducer as frameReducer, IReduxFrame } from './frame'


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
  middleware: [createStateSyncMiddleware()],
});
initMessageListener(store);
