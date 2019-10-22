import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import { SnackbarQueue } from '@rmwc/snackbar'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Overlay } from './overlay'
import { Visu3D } from './visu3D/visu3d'
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
    const visu3D: Visu3D = new Visu3D(document.getElementById('visu3d') as HTMLCanvasElement);
    visu3D.load();
    visu3D.run();
  }, []);

  return <MainWrapper>
    <Overlay />
    <CanvasS id="visu3d" />

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
