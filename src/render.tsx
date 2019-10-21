import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Overlay } from './overlay';
import { Visu3D } from './visu3D/visu3d';


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
  </MainWrapper>
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
);
