import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { updateCtrlData } from '../redux/ctrl_data/actions'
import { parseCtrlData } from '../redux/ctrl_data/parse'
import { IconButton, IconButtonProps, IconButtonHTMLProps } from '@rmwc/icon-button'
import { IPCClient } from '../com/ipc_client'
import { ApplicationState } from '../redux/store'


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
const IconButtonS = styled(IconButton)<IconButtonProps & IconButtonHTMLProps>`
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
  const ipcClient: IPCClient = props.ipcClient;
  const dispatch = useDispatch();

  const isStoring = useSelector((store: ApplicationState) => store.ctrlData !== null ? store.ctrlData.isStoring : false);
  const currentTs = useSelector((store: ApplicationState) => store.world !== null ? store.world.timestamp : 0);

  // Key handlers
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.keyCode === 49) { // 1
        if (!isStoring) {
          ipcClient.sendMessage("start_storing", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
          });
        }
      }
      else if (e.keyCode === 50) { // 2
        if (isStoring) {
          ipcClient.sendMessage("stop_storing", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
          });
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    }
  })

  return <Container>
    <ButtonContainer>
      {isStoring?
        <React.Fragment>
          <IconButtonS icon="stop" label="StopStoring"
            onClick={() => {
              ipcClient.sendMessage("stop_storing", null, (res: any) => {
                const ctrlData: ICtrlData = parseCtrlData(res);
                dispatch(updateCtrlData(ctrlData));
              });
            }}
          />
          <RecLight />
        </React.Fragment>
      :
        <IconButtonS icon="videocam" label="StartStoring"
          onClick={() => {
            ipcClient.sendMessage("start_storing", null, (res: any) => {
              const ctrlData: ICtrlData = parseCtrlData(res);
              dispatch(updateCtrlData(ctrlData));
            });
          }}
        />
      }
    </ButtonContainer>

    <InfoBox>{usToTime(currentTs)} [{currentTs} us]</InfoBox>
  </Container>
}
