import * as React from 'react'
import styled from 'styled-components'
import cn from  'classnames'
import { AppState } from '../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { MDCMenu } from '@material/menu'
import { MDCRipple } from '@material/ripple'
import { setView, ViewAction } from '../state'


const MenuSurfaceS = styled.div`
  top: 217px;
  left: 25px;
  pointer-events: auto;
  float: left;
  min-width: 300px;
  position: absolute;
`
const SpanS = styled.span`
  text-transform: lowercase; 
`

export function SetView() {
  const refMenu = React.useRef(null);
  const refFab = React.useRef(null);
  const dispatch = useDispatch();
  const camView = useSelector((store: AppState) => store.envTab.camView);
  const [menu, setMenu] = React.useState<MDCMenu>();

  React.useEffect(() => {
    const mdcMenu = new MDCMenu(refMenu.current);
    setMenu(mdcMenu);
    new MDCRipple(refFab.current);
  }, []);

  let menuItems = [];
  let i = 0;
  let offset: number = null;
  for (let item in ViewAction) {
    if (isNaN(Number(item))) {
      if (!offset) offset = i;
      const value = i - offset;
      menuItems.push(
        <li key={i} onClick={() => {dispatch(setView(value))}} className="mdc-deprecated-list-item" role="menuitem">
          <span className="mdc-deprecated-list-item__ripple"></span>
          <SpanS className={cn("mdc-deprecated-list-item__text", {"mdc-theme--primary": camView == value} )}>{item}</SpanS>
        </li>
      )
    }
    i++;
  }

  return <>
    <MenuSurfaceS id="main-menu" className="mdc-menu-surface--anchor">
      <div ref={refMenu} className="mdc-menu mdc-menu-surface">
        <ul className="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabIndex={-1}>
          {menuItems}
        </ul>
      </div>
      <button ref={refFab} onClick={() => menu.open = true} className="mdc-fab" aria-label="Menu">
        <div className="mdc-fab__ripple"></div>
        <span className="mdc-fab__icon material-icons">3d_rotation</span>
      </button>
    </MenuSurfaceS>
  </>
}
