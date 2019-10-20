import * as React from 'react';
import styled from 'styled-components';
import { Fab } from '@rmwc/fab';
import { MenuSurfaceAnchor, MenuSurface, MenuItem } from '@rmwc/menu';


const OverlayWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`
const MenuSurfaceAnchorS = styled(MenuSurfaceAnchor)`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
`

export function Overlay() {
  const [openMenu, setOpenMenu] = React.useState(false);

  return <OverlayWrapper>
    <MenuSurfaceAnchorS>
      <MenuSurface open={openMenu} onClose={evt => setOpenMenu(false)}>
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </MenuSurface>
      <Fab icon="menu" onClick={evt => setOpenMenu(!openMenu)} />
    </MenuSurfaceAnchorS>
  </OverlayWrapper>
}
