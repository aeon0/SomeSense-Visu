import { createStore } from 'redux'
// import { loadingBarReducer } from 'react-redux-loading-bar'
import { combineReducers } from 'redux'
import perspective from './perspective/reducer'
import connection from './connection/reducer'


export const store = createStore(
  combineReducers({
    // loadingBar: loadingBarReducer,
    perspective,
    connection,
  }),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),  // this is not working with typescript, needs some google time
);
