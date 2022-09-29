import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
// Test
import { useSelector } from 'react-redux'
import { AppState } from '../../redux/store'


const MainWrapper = styled.div`
  all: inherit;
`

function InterfaceData() {
  const ts = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.timestamp : -1);

  return <MainWrapper>
    Hello World {ts}
  </MainWrapper>
}

const root = createRoot(
  document.getElementById('interface_data_app') as HTMLElement
);
root.render(
  <Provider store={store}>
    <InterfaceData />
  </Provider>);
