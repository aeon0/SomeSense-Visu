import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { IReduxWorld } from '../redux/world/types'
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { IconButton } from '@rmwc/icon-button'
import { IPCServer } from '../com/tcp_sockets'


const Container = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  background: #ffffff12;
  display: flex;
  justify-content: space-between;
`
const ButtonContainer = styled.div`
  display:flex;
  align-items:center;
  padding: 10px;
`
const IconButtonS = styled(IconButton)`
  pointer-events: auto;
  color: #EEE;
`
const InfoBox = styled.div`
  color: #aaa;
  font-size: 13px;
  text-align: right;
  display:flex;
  align-items:center;
  padding-right: 10px;
`
const blinkLightAnimation = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`
const RecLight = styled.div`
  height: 10px;
  width: 10px;
  background-color: #840606;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
  animation: ${blinkLightAnimation} 1.0s cubic-bezier(.5, 0, 1, 1) infinite alternate;
`


function usToTime(durationUs: number) {
  var durationMs: number = Math.floor(durationUs / 1000);
  var milliseconds: number = Math.floor((durationMs % 1000));
  var seconds: number = Math.floor((durationMs / 1000) % 60);
  var minutes: number = Math.floor((durationMs / (1000 * 60)) % 60);
  var hours: number = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

  let h: string = (hours < 10) ? "0" + hours.toString() : hours.toString();
  let m: string = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
  let s: string = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
  let ms: string = (milliseconds < 10) ? "00" + milliseconds.toString() : (milliseconds < 100) ? "0" + milliseconds.toString() : milliseconds.toString();

  return h + ":" + m + ":" + s + "." + ms;
}

export function LiveControls(props: any) {
  const world: IReduxWorld = props.world;  // Null handling needed
  const ctrlData: ICtrlData = props.ctrlData;  // Null handling needed
  const ipcServer: IPCServer = props.ipcServer;

  const [playerTs, setPlayerTs] = React.useState(world !== null ? world.timestamp : 0);
  const [record, setRecord] = React.useState(ctrlData !== null ? ctrlData.isPlaying : false);

  // Update timestamp from props
  React.useEffect(() => { setPlayerTs(world.timestamp); }, [world !== null ? world.timestamp : 0]);
  React.useEffect(() => { setRecord(ctrlData.isStoring); }, [ctrlData !== null ? ctrlData.isPlaying : false]);

  return <Container>
    <ButtonContainer>
      {record?
        <React.Fragment>
          <IconButtonS icon="stop" label="StopStoring"
            onClick={() => {
              ipcServer.sendMessage("stop_storing");
              setRecord(false);
            }}
          />
          <RecLight />
        </React.Fragment>
      :
        <IconButtonS icon="videocam" label="StartStoring"
          onClick={() => {
            ipcServer.sendMessage("start_storing");
            setRecord(true);
          }}
        />
      }
    </ButtonContainer>

    <InfoBox>{usToTime(playerTs)} [{playerTs} us]</InfoBox>
  </Container>
}
