import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Ecal } from './com/ecal'
import { ICom } from './com/icom'

// import { SnackbarQueue } from '@rmwc/snackbar'
import { Overlay } from './overlay'
import { World } from './world3D/world'
// import { snackbarQueue } from './snackbar_queue'

let com: ICom;

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
    com = new Ecal();
    // Start Vis
    const world: World = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  return <MainWrapper>
    <Overlay client={com}/>

    <React.Fragment>
      <CanvasS id="world" />
      <FixedCanvas id="front_cam_img" />
      <HiddenCanvas id="tmp_front_cam_img" />
    </React.Fragment>

    {/* <SnackbarQueue
      messages={snackbarQueue.messages}
      dismissIcon
    /> */}
  </MainWrapper>
}

const root = createRoot(
  document.getElementById('app') as HTMLElement
);
root.render(
  <Provider store={store}> 
    <App />
  </Provider>,
)
