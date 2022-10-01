import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../redux/store'
import { setEnvObstacleVis, setEnvLaneVis } from '../state'
import { MDCRipple } from '@material/ripple'


const FabS = styled.button`
  pointer-events: auto;
  position: fixed;
  left: 25px;
  top: 145px;
`
// const IconButtonS = styled(IconButton)<IconButtonProps & IconButtonHTMLProps>`
//   position: absolute;
//   color: white;
//   right: 0px;
//   top: 6px;
// `

export function Config() {
  const refFab = React.useRef();

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const dispatch = useDispatch();
  const showObstacle = useSelector((store: AppState) => store.envTab.showObstacles);
  const showLane = useSelector((store: AppState) => store.envTab.showLane);

  React.useEffect(() => {
    const fabRipple = new MDCRipple(refFab.current);
  }, []);


  return <>
      {/* <Drawer style={{pointerEvents: "auto"}} dismissible open={openDrawer} dir="rtl">
        <DrawerHeader style={{ background: "#404040" }}>
          <IconButtonS icon="close" label="close" onClick={() => setOpenDrawer(false)} />
          <DrawerTitle dir="ltr">Vis Config</DrawerTitle>
        </DrawerHeader>
        <DrawerContent dir="ltr">
          <List>
            <ListItem onClick={() => dispatch(visActions.setShowPointCloudObstacle(!pcObstacle))}><Checkbox checked={pcObstacle}/> PointCloud Obstacles</ListItem>
            <ListItem onClick={() => dispatch(visActions.setShowPointCloudLane(!pcLane))}><Checkbox checked={pcLane}/> PointCloud Lane</ListItem>
          </List>
        </DrawerContent>
      </Drawer> */}
      
      <FabS ref={refFab} onClick={() => console.log("Open Drawer")} className="mdc-fab" aria-label="Menu">
        <div className="mdc-fab__ripple"></div>
        <span className="mdc-fab__icon material-icons">menu</span>
      </FabS>
  </>
}
