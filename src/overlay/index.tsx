import * as React from 'react'
import styled from 'styled-components'
import { SettingsMenu } from './settings_menu'
import { SelectPerspective } from './select_perspective'
import { ConnectionSetting } from './connection_setting'
import { RecordingControls } from './recording_controls'
import { LiveControls } from './live_controls'
import { RuntimeMeas } from './runtime_meas'
import { useSelector } from 'react-redux'
import { IReduxWorld } from '../redux/world/types'
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { IPCServer } from '../com/tcp_sockets'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: any) {
  const ipcServer: IPCServer = props.ipcServer;

  const world: IReduxWorld = useSelector((store: any) => store.world);
  const ctrlData: ICtrlData = useSelector((store: any) => store.ctrlData);
  const connected: string = useSelector((store: any) => store.connection.connected);
  const showRuntimeMeas: boolean = useSelector((store: any) => store.runtimeMeas.show);

  return <OverlayWrapper>
    {showRuntimeMeas &&
      <RuntimeMeas />
    }

    <SettingsMenu />
    <SelectPerspective />

    <ConnectionSetting />
    
    {/* world can be null in the recording case, has to be handled inside RecordingsControls */}
    {connected && ctrlData && ctrlData.isARecording && 
      <RecordingControls world={world} ctrlData={ctrlData} ipcServer={ipcServer} />
    }

    {connected && world && ctrlData && !ctrlData.isARecording &&
      <LiveControls world={world} ctrlData={ctrlData} ipcServer={ipcServer} />
    }
  </OverlayWrapper>
}
