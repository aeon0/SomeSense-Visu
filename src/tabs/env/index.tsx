
import React from 'react';
import styled from 'styled-components'
import { World } from './3d/world'
import { Images } from './overlay/images'
import { Config } from './overlay/config'


const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`

export function Env() {
  React.useEffect(() => {
    const world = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  return (<>
      <Images />
      <Config />
      <CanvasS id="world" />
  </>);
}
