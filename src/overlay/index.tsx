import * as React from 'react'
import styled from 'styled-components'
import { ICom } from '../com/icom'
import { Tabbar } from './tabbar'
import { Menu } from './menu'
import { RuntimeMeas } from './runtime_meas'
import { AppState } from '../redux/store'
import { useSelector } from 'react-redux'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: {client: ICom}) {
  const showRuntimeMeas = useSelector((store: AppState) => store.settings.showRuntimeMeas);

  return <OverlayWrapper>
    <Tabbar />
    {showRuntimeMeas &&
      <RuntimeMeas />
    }
    <Menu />
  </OverlayWrapper>
}
