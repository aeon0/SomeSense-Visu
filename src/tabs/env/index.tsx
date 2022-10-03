
import React from 'react';
import styled from 'styled-components'
import { World } from './3d/world'
import { Images } from './overlay/images'
import { Config } from './overlay/config'
import { SetView } from './overlay/set_view'


const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`
const OverlayWrapperS = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Env() {
  React.useEffect(() => {
    const world = new World(document.getElementById('world') as HTMLCanvasElement);
    world.load();
    world.run();
  }, []);

  return (<>
      <OverlayWrapperS>
        <Images />
        <Config />
        <SetView />
      </OverlayWrapperS>
      <CanvasS id="world" />
  </>);
}
