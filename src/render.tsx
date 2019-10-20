import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
import { Visu3D } from './visu3D/visu3d';


class App extends React.Component<{}, {}> {
  // Before the component mounts, we initialise our state
  componentWillMount() {

  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    const canvas: HTMLCanvasElement = document.getElementById('visu3d') as HTMLCanvasElement;
    const visu3D: Visu3D = new Visu3D(canvas);
    visu3D.load();
    visu3D.run();
  }

  render() {
    return <React.Fragment>
      <div>React Babylon.js Typescript Electron</div>
      <canvas id="visu3d"></canvas>
    </React.Fragment>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
);
