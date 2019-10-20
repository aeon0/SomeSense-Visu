import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ThemeProvider } from '@rmwc/theme';
import { Overlay } from './overlay';
import { Visu3D } from './visu3D/visu3d';


const ThemeProviderS = styled(ThemeProvider)`
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

  return <ThemeProviderS
    options={{
      primary: '#424242',
      secondary: '#424242'
    }}
  >
    <Overlay />
    <CanvasS id="visu3d" />
  </ThemeProviderS>
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
);
