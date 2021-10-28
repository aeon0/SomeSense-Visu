import { createStore, compose } from 'redux'
import { combineReducers } from 'redux'
import connection, { IReduxConnection } from './connection/reducer'
import {world, worldRaw} from './world/reducer'
import { IReduxWorld } from './world/types'
import ctrlData, { ICtrlData } from './ctrl_data/reducer'
import runtimeMeasStore, { IRuntimeMeasStore } from './runtime_meas/reducer'
import vis, { IReduxVis } from './vis/reducer'


declare global { interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; } }
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface ApplicationState {
  connection: IReduxConnection,
  world: IReduxWorld,
  worldRaw: Uint8Array,
  ctrlData: ICtrlData,
  runtimeMeasStore: IRuntimeMeasStore,
  vis: IReduxVis,
}

export const store = createStore(
  combineReducers<ApplicationState>({
    connection,
    world,
    worldRaw,
    ctrlData,
    runtimeMeasStore,
    vis,
  }),
  composeEnhancers(),
);
