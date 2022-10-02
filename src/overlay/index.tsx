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
import { WaitForConnection } from './wait_for_connection'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: {client: ICom}) {
  const showRuntimeMeas = useSelector((store: AppState) => store.settings.showRuntimeMeas);
  const isRec = useSelector((store: AppState) => store.recMeta.isRec);
  const connected = useSelector((store: AppState) => store.connection.connected);

  return <OverlayWrapper>
    <Tabbar />
    {showRuntimeMeas &&
      <RuntimeMeas />
    }
    <Menu client={props.client}/>
    {!isRec && connected &&
      <LiveControls client={props.client} />
    }
    {isRec && connected &&
      <RecControls client={props.client} />
    }
    {!connected && 
      <WaitForConnection />
    }
  </OverlayWrapper>
}
