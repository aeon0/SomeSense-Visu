import * as React from 'react';
import styled from 'styled-components';
import { Fab } from '@rmwc/fab';
import { MenuSurfaceAnchor, MenuSurface, MenuItem } from '@rmwc/menu';

const MenuSurfaceAnchorS = styled(MenuSurfaceAnchor)`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
`

export function SettingsMenu() {
  const [openMenu, setOpenMenu] = React.useState(false);

  return <React.Fragment>
    <MenuSurfaceAnchorS>
      <MenuSurface open={openMenu} onClose={evt => setOpenMenu(false)}>
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </MenuSurface>
      <Fab icon="menu" onClick={evt => setOpenMenu(!openMenu)} />
    </MenuSurfaceAnchorS>
  </React.Fragment>
}
