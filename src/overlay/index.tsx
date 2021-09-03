import * as React from 'react'
import styled from 'styled-components'
import { SettingsMenu } from './settings_menu'
import { ConnectionSetting } from './connection_setting'
import { RecordingControls } from './recording_controls'
import { LiveControls } from './live_controls'
import { RuntimeMeas } from './runtime_meas'
import { ImageOverlay } from './image_overlay'
import { VisConfig } from './vis_config'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../redux/store'
import { IPCClient } from '../com/ipc_client'


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay(props: any) {
  const ipcClient: IPCClient = props.ipcClient;

  const isARecording = useSelector((store: ApplicationState) => store.ctrlData !== null ? store.ctrlData.isARecording : null);
  const connected = useSelector((store: ApplicationState) => store.connection.connected);
  const showRuntimeMeas = useSelector((store: ApplicationState) => store.runtimeMeasStore.show);
  const hasCamSensor = useSelector((store: ApplicationState) => (store.world !== null && store.world.camSensors.length > 0));

  return <OverlayWrapper>
    {showRuntimeMeas &&
      <RuntimeMeas />
    }
    <SettingsMenu />
    <ConnectionSetting />
    <VisConfig />
    
    {/* world can be null in the recording case, has to be handled inside RecordingsControls */}
    {connected && isARecording !== null && isARecording && 
      <RecordingControls ipcClient={ipcClient} />
    }

    {connected && isARecording !== null && !isARecording &&
      <LiveControls ipcClient={ipcClient} />
    }
    {hasCamSensor &&
      <ImageOverlay />
    }
  </OverlayWrapper>
}
