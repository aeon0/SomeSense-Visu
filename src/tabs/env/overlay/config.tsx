import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../redux/store'
import { setEnvObstacleVis, setEnvLaneVis, setCamFrustum } from '../state'
import { MDCRipple } from '@material/ripple'
import { MDCDrawer } from '@material/drawer'
import { IconButton } from '../../../util/mdc/icon_button'
import { Checkbox } from '../../../util/mdc/checkbox'


const FabS = styled.button`
  pointer-events: auto;
  position: absolute;
  left: 25px;
  top: 145px;
`
const IconButtonS = styled(IconButton)`
  position: absolute;
  color: white;
  right: 8px;
  top: 8px;
`


export function Config() {
  const refFab = React.useRef();
  const refDrawer = React.useRef();

  const [drawer, setDrawer] = React.useState<MDCDrawer>();

  const dispatch = useDispatch();
  const showObstacle = useSelector((store: AppState) => store.envTab.showObstacles);
  const showLane = useSelector((store: AppState) => store.envTab.showLane);
  const showCamFrustum = useSelector((store: AppState) => store.envTab.showCamFrustum);

  React.useEffect(() => {
    new MDCRipple(refFab.current);
    new MDCRipple(refFab.current);
    const drawer = new MDCDrawer(refDrawer.current);
    setDrawer(drawer);
  }, []);

  return <>
      <aside style={{pointerEvents: "auto"}} ref={refDrawer} className="mdc-drawer mdc-drawer--dismissible">
        <div style={{ background: "#404040" }} className="mdc-drawer__header">
          <IconButtonS icon="close" onClick={() => drawer.open = !drawer.open} />
          <h5 className="mdc-drawer__title">Draw Config</h5>
        </div>
        <div className="mdc-drawer__content">
          <ul className="mdc-deprecated-list" role="group" aria-orientation="vertical" tabIndex={-1}>
            <Checkbox uniqueId="env-settings-pointcloud" label="Pointcloud" checked={showObstacle}
              onChange={(evt) => dispatch(setEnvObstacleVis(evt.target.checked)) }/>
            <Checkbox uniqueId="env-settings-lanemarkings" label="Lanemarkings" checked={showLane}
              onChange={(evt) => dispatch(setEnvLaneVis(evt.target.checked))}/>
            <Checkbox uniqueId="env-settings-camfrustum" label="Camera Frustum" checked={showCamFrustum}
              onChange={(evt) => dispatch(setCamFrustum(evt.target.checked))}/>
          </ul>
        </div>
      </aside>

      <FabS ref={refFab} onClick={() => { drawer.open = !drawer.open; }} className="mdc-fab" aria-label="Config">
        <div className="mdc-fab__ripple"></div>
        <span className="mdc-fab__icon material-icons">draw</span>
      </FabS>
  </>
}
