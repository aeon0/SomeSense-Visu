import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'


const MainWrapper = styled.div`
  all: inherit;
`

function InterfaceData() {
  return <MainWrapper>
    Hello World
  </MainWrapper>
}

const root = createRoot(
  document.getElementById('interface_data_app') as HTMLElement
);
root.render(
  <Provider store={store}>
    <InterfaceData />
  </Provider>);
