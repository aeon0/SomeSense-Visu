import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import { SnackbarQueue } from '@rmwc/snackbar'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Overlay } from './overlay'
import { World } from './world3D/world'
import { snackbarQueue } from './snackbar_queue';


const MainWrapper = styled.div`
  all: inherit;
`
const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`

function App() {
  // Only runs on mount
  React.useEffect(() => {
    const world: World = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  return <MainWrapper>
    <Overlay />
    <CanvasS id="world" />

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
