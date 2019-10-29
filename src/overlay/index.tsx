import * as React from 'react';
import styled from 'styled-components';
import { SettingsMenu } from './settings_menu';
import { SelectPerspective } from './select_perspective';
import { ConnectionSetting } from './connection_setting';


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`

export function Overlay() {
  return <OverlayWrapper>
    <SettingsMenu />
    <SelectPerspective />
    <ConnectionSetting />
  </OverlayWrapper>
}
