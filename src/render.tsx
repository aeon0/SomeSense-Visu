import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import { SnackbarQueue } from '@rmwc/snackbar'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Overlay } from './overlay'
import { World } from './world3D/world'
import { snackbarQueue } from './snackbar_queue'
import { IPCClient } from './com/ipc_client'


// Connect to server
const ipcClient = new IPCClient();

const MainWrapper = styled.div`
  all: inherit;
`
const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`
const FixedCanvas = styled.canvas`
  position: fixed;
`
const HiddenCanvas = styled.canvas`
  display: none;
`

function App() {
  // Only runs on mount
  React.useEffect(() => {
    const world: World = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  return <MainWrapper>
    <Overlay ipcClient={ipcClient}/>

    <React.Fragment>
      <CanvasS id="world" />
      <FixedCanvas id="front_cam_img" />
      <HiddenCanvas id="tmp_front_cam_img" />
    </React.Fragment>

    <SnackbarQueue
      messages={snackbarQueue.messages}
      dismissIcon
    />
  </MainWrapper>
}

ReactDOM.render(
  <Provider store={store}> 
    <App />
  </Provider>,
  document.getElementById('app') as HTMLElement
);
