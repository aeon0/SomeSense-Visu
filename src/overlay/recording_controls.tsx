import * as React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { IReduxWorld } from '../redux/world/types'


// const ButtonS = styled(Button)`
//   pointer-events: auto;
//   background: #bf4949 !important;
// `

export function RecordingControls(props: any) {
  const dispatch = useDispatch();
  const world: IReduxWorld = props.world;

  console.log(world.timestamp);

  return <React.Fragment>
    BLABLABLABLASDFASDF
    {world.timestamp}
  </React.Fragment>
}
