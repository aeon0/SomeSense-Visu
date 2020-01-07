import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { SnackbarQueue } from '@rmwc/snackbar'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Overlay } from './overlay'
import { World } from './world3D/world'
import { RuntimeMeas } from './runtime_meas'
import { snackbarQueue } from './snackbar_queue'
import { IPCServer } from './com/tcp_sockets'


// Connect to server
const ipcServer = new IPCServer();

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

function App() {
  // Only runs on mount
  React.useEffect(() => {
    const world: World = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  const showRuntimeMeas: boolean = useSelector((store: any) => store.runtimeMeas.show);

  console.log(showRuntimeMeas);

  return <MainWrapper>
    <Overlay ipcServer={ipcServer}/>

    {showRuntimeMeas &&
      <RuntimeMeas />
    }
    <React.Fragment>
      <CanvasS id="world" />
      <FixedCanvas id="front_cam_img" />
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
