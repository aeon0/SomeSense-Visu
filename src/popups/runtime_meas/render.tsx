import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import { RuntimeMeas } from './runtime_meas'


const root = createRoot(
  document.getElementById('runtime_meas_app') as HTMLElement
);
root.render(
  <Provider store={store}>
    <RuntimeMeas />
  </Provider>
);
