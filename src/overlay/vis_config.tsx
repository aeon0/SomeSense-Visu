import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Fab, FabProps } from '@rmwc/fab'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@rmwc/drawer'
import { List, ListItem } from '@rmwc/list'
import { Checkbox } from '@rmwc/checkbox'
import { IconButton, IconButtonProps, IconButtonHTMLProps} from '@rmwc/icon-button'
import * as visActions from '../redux/vis/actions'
import { setConnecting } from '../redux/connection/actions'
import { ApplicationState } from '../redux/store'


const FabS = styled(Fab)<FabProps & React.HTMLProps<HTMLElement>>`
  margin-top: 25px;
  margin-right: 25px;
  pointer-events: auto;
  float: right;
`
const IconButtonS = styled(IconButton)<IconButtonProps & IconButtonHTMLProps>`
  position: absolute;
  color: white;
  right: 0px;
  top: 6px;
`

export function VisConfig() {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const dispatch = useDispatch();
  const pcObstacle = useSelector((store: ApplicationState) => store.vis.showPointCloudObstacle);
  const pcLane = useSelector((store: ApplicationState) => store.vis.showPointCloudLane);

  return <React.Fragment>
      <Drawer style={{pointerEvents: "auto"}} dismissible open={openDrawer} dir="rtl">
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
      </Drawer>
      <FabS icon="edit" onClick={() => setOpenDrawer(!openDrawer)} />
  </React.Fragment>
}
