import * as React from 'react'
import styled from 'styled-components'
import { ICom } from '../com/icom'
import { AppState } from '../redux/store'
import { useSelector } from 'react-redux'

import { Tabbar } from './tabbar'
import { Menu } from './menu'
import { RuntimeMeas } from './runtime_meas'
import { LiveControls } from './live_controls'
import { RecControls } from './rec_controls'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: {client: ICom}) {
  const showRuntimeMeas = useSelector((store: AppState) => store.settings.showRuntimeMeas);
  const isRec = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.isRec : null);

  return <OverlayWrapper>
    <Tabbar />
    {showRuntimeMeas &&
      <RuntimeMeas />
    }
    <Menu />
    {isRec !== null && !isRec &&
      <LiveControls client={props.client} />
    }
    {isRec !== null && isRec &&
      <RecControls client={props.client} />
    }

  </OverlayWrapper>
}
