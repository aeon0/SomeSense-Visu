import { createStore, compose } from 'redux'
import { combineReducers } from 'redux'
import perspective from './perspective/reducer'
import connection from './connection/reducer'
import world from './world/reducer'


declare global { interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; } }
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers({
    perspective,
    connection,
    world,
  }),
  composeEnhancers(),
);
