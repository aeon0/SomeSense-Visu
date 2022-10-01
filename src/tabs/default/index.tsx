
import React from 'react';
import styled from 'styled-components'
import { ICom } from '../../com/icom'
import { World } from './world'
import { ImageOverlay } from './image_overlay'


const CanvasS = styled.canvas`
  all: inherit;
  touch-action: none;
`

export function Default(props: any) {
  const client: ICom = props.client;

  const [absTs, setAbsTs] = React.useState(-1);

  console.log("HERE");

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
