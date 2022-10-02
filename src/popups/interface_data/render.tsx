import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import ReactJson from 'react-json-view'
import { useSelector } from 'react-redux'
import { AppState, store } from '../../redux/store'


const MainWrapper = styled.div`
  all: inherit;
`

function InterfaceData() {
  let lastUpdate: number = null;
  const delay: number = 400; // in [ms]

  let data = useSelector((store: AppState) => store.frame.data, () => {
    if (!lastUpdate || !store.getState().recMeta.isPlaying || ((Date.now() - lastUpdate) > delay)) {
      lastUpdate = Date.now();
      return false;
    }
    return true;
  });
  let jsonObj = {"info": "No Data avaiable"};
  if (data !== null) {
    let jsonStr = JSON.stringify(data, (key, value) => {
      if (key == "obstacles" || key == "laneMarkings") {
        return "Not displayed because of performance reasons: " + value.length + " items";
      }
      return value;
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
  </Provider>
);
