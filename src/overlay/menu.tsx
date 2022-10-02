import * as React from 'react'
import styled from 'styled-components'
import { MDCMenu } from '@material/menu'
import { MDCRipple } from '@material/ripple'
import { exportImg } from '../util/img_data'
import { createInterfaceDataWindow } from '../popups/interface_data/main'
import { createRuntimeMeasWindow } from '../popups/runtime_meas/main'
import { ICom } from '../com/icom'


const MenuSurfaceS = styled.div`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
  float: left;
  min-width: 300px;
`

export function Menu(props: {client: ICom}) {
  const refMenu = React.useRef(null);
  const refFab = React.useRef(null);

  const [menu, setMenu] = React.useState<MDCMenu>();

  React.useEffect(() => {
    const mdcMenu = new MDCMenu(refMenu.current);
    setMenu(mdcMenu);
    new MDCRipple(refFab.current);
  }, []);


  const MenuItem = (props: {name: string, onClick?: Function}) => <>
    <li onClick={() => props.onClick ? props.onClick(): {}} className="mdc-deprecated-list-item" role="menuitem">
      <span className="mdc-deprecated-list-item__ripple"></span>
      <span className="mdc-deprecated-list-item__text">{props.name}</span>
    </li>
  </>

  return <>
    <MenuSurfaceS id="main-menu" className="mdc-menu-surface--anchor">
      <div ref={refMenu} className="mdc-menu mdc-menu-surface">
        <ul className="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabIndex={-1}>
          <MenuItem name="Export Image" onClick={() => exportImg(null, 0)}/>
          <MenuItem name="Open Interface Data" onClick={() => createInterfaceDataWindow()}/>
          <MenuItem name="Open Runtime Meas" onClick={() => createRuntimeMeasWindow()}/>
          <MenuItem name="Sync Frame" onClick={() => props.client.sendMsg("frame_ctrl", {"action": "sync"}, () => {})} />
        </ul>
      </div>
      <button ref={refFab} onClick={() => menu.open = true} className="mdc-fab" aria-label="Menu">
        <div className="mdc-fab__ripple"></div>
        <span className="mdc-fab__icon material-icons">menu</span>
      </button>
    </MenuSurfaceS>
  </>
}
