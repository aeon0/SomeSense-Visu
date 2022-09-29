import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import ReactJson from 'react-json-view'
import { useSelector } from 'react-redux'
import { AppState } from '../../redux/store'


const MainWrapper = styled.div`
  all: inherit;
`

function InterfaceData() {
  let data = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data : null);
  let jsonObj = {"info": "No Data avaiable"};
  if (data !== null) {
    let jsonStr = JSON.stringify(data, (key, value) => {
      if (key != "data") return value;
      else return null;
    });
    jsonObj = JSON.parse(jsonStr);
  }

  return <MainWrapper>
    <ReactJson src={jsonObj} theme="railscasts"/>
  </MainWrapper>
}

const root = createRoot(
  document.getElementById('interface_data_app') as HTMLElement
);
root.render(
  <Provider store={store}>
    <InterfaceData />
  </Provider>);
