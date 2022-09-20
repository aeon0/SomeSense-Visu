import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { reducer as connectionReducer, IReduxConnection } from './connection'


export interface ApplicationState {
  connection: IReduxConnection,
}

const reducer = combineReducers<ApplicationState>({
  connection: connectionReducer,
});

export const store = configureStore({reducer});
