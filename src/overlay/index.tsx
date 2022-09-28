import * as React from 'react'
import styled from 'styled-components'
import { ImageOverlay } from './image_overlay'
import { useSelector } from 'react-redux'
import { AppState } from '../redux/store'
import { ICom } from '../com/icom'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: any) {
  const client: ICom = props.client;

  const hasCamSensor = useSelector((store: AppState) => (store.frame.data !== null && store.frame.data.camSensors.length > 0));

  return <OverlayWrapper>
    {hasCamSensor &&
      <ImageOverlay />
    }
  </OverlayWrapper>
}
