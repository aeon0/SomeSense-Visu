import * as React from 'react'
import styled from 'styled-components'
import { SettingsMenu } from './settings_menu'
import { SelectPerspective } from './select_perspective'
import { ConnectionSetting } from './connection_setting'
import { RecordingControls } from './recording_controls'
import { useSelector } from 'react-redux'
import { IReduxWorld } from '../redux/world/types';


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay() {
  const world: IReduxWorld = useSelector((store: any) => store.world);

  return <OverlayWrapper>
    <SettingsMenu />
    <SelectPerspective />
    <ConnectionSetting />
    {world && world.isRecording &&
      <RecordingControls world={world} />
    }
  </OverlayWrapper>
}
