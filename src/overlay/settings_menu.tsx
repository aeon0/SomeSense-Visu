import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Fab } from '@rmwc/fab'
import { MenuSurfaceAnchor, MenuSurface, MenuItem } from '@rmwc/menu'
import { showRuntimeMeas, hideRuntimeMeas } from '../redux/runtime_meas/actions'

const MenuSurfaceAnchorS = styled(MenuSurfaceAnchor)`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
`

export function SettingsMenu() {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = React.useState(false);
  const showRuntimeMeasFlag = useSelector((store: any) => store.runtimeMeas.show);

  return <React.Fragment>
    <MenuSurfaceAnchorS>
      <MenuSurface open={openMenu} onClose={evt => setOpenMenu(false)}>
        {showRuntimeMeasFlag ?
        <MenuItem onClick={() => { dispatch(hideRuntimeMeas()); console.log("HERE");}}>Hide Runtime Meas</MenuItem>
        :
        <MenuItem onClick={() => { dispatch(showRuntimeMeas()); console.log("Show");}}>Show Runtime Meas</MenuItem>
        }
      </MenuSurface>
      <Fab icon="menu" onClick={evt => setOpenMenu(!openMenu)} />
    </MenuSurfaceAnchorS>
  </React.Fragment>
}
