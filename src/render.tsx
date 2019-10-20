import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Visu3D } from './visu3D/visu3d';
import { blurPixelShader } from 'babylonjs/Shaders/blur.fragment';

const Canvas = styled.canvas`
  touch-action: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

function App() {
  // Only runs on mount
  React.useEffect(() => {
    const visu3D: Visu3D = new Visu3D(document.getElementById('visu3d') as HTMLCanvasElement);
    visu3D.load();
    visu3D.run();
  }, []);

  function buhYeah() {
    console.log("Something to log!");
  }

  return <React.Fragment>
    <div>React Babylon.js Typescript Electron</div>
    <button onClick={() => buhYeah()}>click me</button>
    <Canvas id="visu3d"></Canvas>
  </React.Fragment>
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
);
