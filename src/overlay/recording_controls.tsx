import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationState } from '../redux/store'
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { updateCtrlData } from '../redux/ctrl_data/actions'
import { parseCtrlData } from '../redux/ctrl_data/parse'
import { Slider, SliderProps, SliderHTMLProps } from '@rmwc/slider'
import { IconButton, IconButtonProps, IconButtonHTMLProps } from '@rmwc/icon-button'
import { ThemeProvider } from '@rmwc/theme'
import { IPCClient } from '../com/ipc_client'


const Container = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  padding-top: 10px;
  background: #ffffff12; 
`
const SliderContainer = styled.div`
  width: 90%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
`
const SliderS = styled(Slider)<SliderProps & SliderHTMLProps>`
  pointer-events: auto;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const IconButtonS = styled(IconButton)<IconButtonProps & IconButtonHTMLProps>`
  pointer-events: auto;
  color: #EEE;
`
const InfoBox = styled.div`
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
`

function usToTime(durationUs: number) {
  var milliseconds: number = Math.floor(durationUs / 1000);
  var seconds: number = Math.floor((milliseconds / 1000) % 60);
  var minutes: number = Math.floor((milliseconds / (1000 * 60)) % 60);
  var hours: number = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  let h: string = (hours < 10) ? "0" + hours.toString() : hours.toString();
  let m: string = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
  let s: string = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
  let ms: string = milliseconds.toString();

  return h + ":" + m + ":" + s + "." + ms;
}

export function RecordingControls(props: any) {
  var lastUpdate: number = -1;
  const ipcClient: IPCClient = props.ipcClient;
  const dispatch = useDispatch();

  const currentTs = useSelector((store: ApplicationState) => store.world !== null ? store.world.timestamp : 0);
  const play = useSelector((store: ApplicationState) => store.ctrlData !== null ? store.ctrlData.isPlaying : false);
  const recLength = useSelector((store: ApplicationState) => store.ctrlData !== null ? store.ctrlData.recLength : 0);

  const [playerTs, setPlayerTs] = React.useState(currentTs);
  React.useEffect(() => setPlayerTs(currentTs), [currentTs]);

  // Key handlers
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.keyCode === 49) { // 1
        if (play) {
          ipcClient.sendMessage("pause_rec", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
          });
        }
        else {
          ipcClient.sendMessage("play_rec", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
          });
        }
      }
      else if (e.keyCode === 50) { // 2
        if (!play) {
          ipcClient.sendMessage("step_backward", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
            ipcClient.sendMessage("reset_algo")
          });
        }
      }
      else if (e.keyCode === 51) { // 3
        if (!play) {
          ipcClient.sendMessage("step_forward", null, (res: any) => {
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
      <IconButtonS icon="keyboard_arrow_left" label="Step Back" disabled={play}
        onClick={() => {
          ipcClient.sendMessage("step_backward", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
            ipcClient.sendMessage("reset_algo")
          });
        }}
      />
      {play ?
        <IconButtonS icon="pause" label="Pause" disabled={currentTs >= recLength}
          onClick={() => {
            ipcClient.sendMessage("pause_rec", null, (res: any) => {
              const ctrlData: ICtrlData = parseCtrlData(res);
              dispatch(updateCtrlData(ctrlData));
            });
          }}
        />
      :
        <IconButtonS icon="play_arrow" label="Play" disabled={currentTs >= recLength}
          onClick={() => {
            ipcClient.sendMessage("play_rec", null, (res: any) => {
              const ctrlData: ICtrlData = parseCtrlData(res);
              dispatch(updateCtrlData(ctrlData));
            });
          }}
        />
      }
      <IconButtonS icon="keyboard_arrow_right" label="Step Forward" disabled={play}
        onClick={() => {
          ipcClient.sendMessage("step_forward", null, (res: any) => {
            const ctrlData: ICtrlData = parseCtrlData(res);
            dispatch(updateCtrlData(ctrlData));
          });
        }}
      />
    </ButtonContainer>

    <ThemeProvider
      options={{
        primary: 'black',
        secondary: "#EEE",
      }}
    >
      <SliderContainer>
        <SliderS
          value={playerTs}
          onChange={(evt: any) => {
            // TODO: somehow this is called twice, using this ugly hack for now
            var value: number = evt.detail.value;
            if (value !== lastUpdate) {
              lastUpdate = value;
              ipcClient.sendMessage("jump_to_ts", Math.floor(value), (res: any) => {
                const ctrlData: ICtrlData = parseCtrlData(res);
                dispatch(updateCtrlData(ctrlData));
                ipcClient.sendMessage("reset_algo");
              });
            }
          }}
          onInput={(evt: any) => {
            if (play) {
              ipcClient.sendMessage("pause_rec", null, (res: any) => {
                const ctrlData: ICtrlData = parseCtrlData(res);
                dispatch(updateCtrlData(ctrlData));
              });
            }
            setPlayerTs(Math.floor(evt.detail.value));
          }}
          min={0}
          max={recLength}
        />
      </SliderContainer>
    </ThemeProvider>

    <InfoBox>{usToTime(playerTs)} [{playerTs} us]</InfoBox>
  </Container>
}
