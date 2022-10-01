
import React from 'react';
import styled from 'styled-components'
import { World } from './3d/world'
import { ImageOverlay } from './2d/image_overlay'


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
      <CanvasS id="world" />
      <ImageOverlay />
  </>);
}
