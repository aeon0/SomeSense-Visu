import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Fab } from '@rmwc/fab'
import { MenuSurfaceAnchor, MenuSurface, MenuItem } from '@rmwc/menu'
import { showRuntimeMeas, hideRuntimeMeas } from '../redux/runtime_meas/actions'
import { setConnecting } from '../redux/connection/actions'
import { ApplicationState } from '../redux/store'
// imports for exporting image, maybe should be put somewhere more common in the future
import * as fs from 'fs'
import { encode } from 'fast-png'


const MenuSurfaceAnchorS = styled(MenuSurfaceAnchor)`
  margin-top: 25px;
  margin-left: 25px;
  pointer-events: auto;
  float: left;
  min-width: 300px;
`

function exportImg(imgData: ImageData, ts: number) {
  if (imgData === null)
    return;

  var pngImg = encode({
    width: imgData.width,
    height: imgData.height,
    data: new Uint8Array(imgData.data)
  });
  const exportDir = "export";
  !fs.existsSync(exportDir) && fs.mkdirSync(exportDir);
  const saveTo = exportDir + "/" + ts.toString() + ".png";
  fs.writeFile(saveTo, pngImg, err => {
    if (err) {
      console.log("An error ocurred saving the image " + err.message);
    } else {
      console.log("Image has been saved as " + saveTo);
    }
  });
}

export function SettingsMenu() {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = React.useState(false);
  const showRuntimeMeasFlag = useSelector((store: ApplicationState) => store.runtimeMeasStore.show);
  const connected = useSelector((store: ApplicationState) => store.connection.connected);
  const imgData = useSelector((store: ApplicationState) => store.world !== null ? store.world.camSensors[0].imageData : null);
  const currentTs = useSelector((store: ApplicationState) => store.world !== null ? store.world.timestamp : 0);

  return <React.Fragment>
    <MenuSurfaceAnchorS>
      <MenuSurface open={openMenu} onClose={() => setOpenMenu(false)}>
        {showRuntimeMeasFlag ?
        <MenuItem onClick={() => { dispatch(hideRuntimeMeas()); setOpenMenu(false);}}>Hide Runtime Meas</MenuItem>
        :
        <MenuItem onClick={() => { dispatch(showRuntimeMeas()); setOpenMenu(false);}}>Show Runtime Meas</MenuItem>
        }
        {connected && <MenuItem onClick={() => dispatch(setConnecting(false))}>Disconnect</MenuItem>}
        <MenuItem onClick={() => exportImg(imgData, currentTs)}>Export Image</MenuItem>
      </MenuSurface>
      <Fab icon="menu" onClick={() => setOpenMenu(!openMenu)} />
    </MenuSurfaceAnchorS>
  </React.Fragment>
}
