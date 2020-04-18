import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Fab } from '@rmwc/fab'
import { MenuSurfaceAnchor, MenuSurface, MenuItem } from '@rmwc/menu'
import { showRuntimeMeas, hideRuntimeMeas } from '../redux/runtime_meas/actions'
import { ApplicationState } from '../redux/store'


const MenuSurfaceAnchorS = styled(MenuSurfaceAnchor)`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
  float: left;
  min-width: 300px;
`

export function SettingsMenu() {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = React.useState(false);
  const showRuntimeMeasFlag = useSelector((store: ApplicationState) => store.runtimeMeasStore.show);

  return <React.Fragment>
    <MenuSurfaceAnchorS>
      <MenuSurface open={openMenu} onClose={() => setOpenMenu(false)}>
        {showRuntimeMeasFlag ?
        <MenuItem onClick={() => { dispatch(hideRuntimeMeas()); setOpenMenu(false);}}>Hide Runtime Meas</MenuItem>
        :
        <MenuItem onClick={() => { dispatch(showRuntimeMeas()); setOpenMenu(false);}}>Show Runtime Meas</MenuItem>
        }
      </MenuSurface>
      <Fab icon="menu" onClick={() => setOpenMenu(!openMenu)} />
    </MenuSurfaceAnchorS>
  </React.Fragment>
}
