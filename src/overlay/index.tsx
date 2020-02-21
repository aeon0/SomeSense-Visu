import * as React from 'react'
import styled from 'styled-components'
import { SettingsMenu } from './settings_menu'
import { SelectPerspective } from './select_perspective'
import { ConnectionSetting } from './connection_setting'
import { RecordingControls } from './recording_controls'
import { LiveControls } from './live_controls'
import { useSelector } from 'react-redux'
import { IReduxWorld } from '../redux/world/types'
import { ICtrlData } from '../redux/ctrl_data/types'
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

  return <OverlayWrapper>
    <SettingsMenu />
    <SelectPerspective />
    <ConnectionSetting />
    {world && ctrlData.isARecording &&
      <RecordingControls world={world} ctrlData={ctrlData} ipcServer={ipcServer} />
    }
    {world && !ctrlData.isARecording &&
      <LiveControls world={world} ctrlData={ctrlData} ipcServer={ipcServer} />
    }
  </OverlayWrapper>
}
