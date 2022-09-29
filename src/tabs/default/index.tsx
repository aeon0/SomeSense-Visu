
import React from 'react';
import styled from 'styled-components'
import { ICom } from '../../com/icom'
import { World } from '../../util/babylon/world'
import { useSelector } from 'react-redux'
import { AppState } from '../../redux/store'


const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`

export function Default(props: any) {
  const client: ICom = props.client;

  const ts = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.timestamp : -1);
  console.log(ts);

  React.useEffect(() => {
    const world: World = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.engine.runRenderLoop(() => {
      world.scene.render();
    });
  }, []);

  return (<>
      <CanvasS id="world" />
  </>);
}
