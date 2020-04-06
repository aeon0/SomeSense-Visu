import { createStore, compose } from 'redux'
import { combineReducers } from 'redux'
import perspective, { IReduxPerspective } from './perspective/reducer'
import connection, { IReduxConnection } from './connection/reducer'
import world from './world/reducer'
import { IReduxWorld } from './world/types'
import ctrlData, { ICtrlData } from './ctrl_data/reducer'
import runtimeMeas, { IRuntimeMeasCtrl } from './runtime_meas/reducer'
import sensorStorage, { ISensorData } from './sensor_storage/reducer'


declare global { interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; } }
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface ApplicationState {
  perspective: IReduxPerspective,
  connection: IReduxConnection,
  world: IReduxWorld,
  ctrlData: ICtrlData,
  runtimeMeas: IRuntimeMeasCtrl,
  sensorStorage: ISensorData[],
}

export const store = createStore(
  combineReducers<ApplicationState>({
    perspective,
    connection,
    world,
    ctrlData,
    runtimeMeas,
    sensorStorage,
  }),
  composeEnhancers(),
);
