import * as React from 'react'
import styled from 'styled-components'
import { ICom } from '../com/icom'
import { Tabbar } from './tabbar'
import { Menu } from './menu'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

interface OverlayProps {
  client: ICom
}

export function Overlay(props: OverlayProps) {
  return <OverlayWrapper>
    <Tabbar />
    <Menu />
  </OverlayWrapper>
}
