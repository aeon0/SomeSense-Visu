import * as React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../redux/store'
import { Slider } from '@rmwc/slider'
import { IconButton } from '@rmwc/icon-button'
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
const SliderS = styled(Slider)`
  pointer-events: auto;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const IconButtonS = styled(IconButton)`
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
  const ipcClient: IPCClient = props.ipcClient;

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
          ipcClient.sendMessage("pause_rec");
        }
        else {
          ipcClient.sendMessage("play_rec");
        }
      }
      else if (e.keyCode === 50) { // 2
        if (!play) {
          ipcClient.sendMessage("step_backward");
        }
      }
      else if (e.keyCode === 51) { // 3
        if (!play) {
          ipcClient.sendMessage("step_forward");
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
        onClick={() => ipcClient.sendMessage("step_backward")}
      />
      {play ?
        <IconButtonS icon="pause" label="Pause" disabled={currentTs >= recLength}
          onClick={() => {
            ipcClient.sendMessage("pause_rec");
          }}
        />
      :
        <IconButtonS icon="play_arrow" label="Play" disabled={currentTs >= recLength}
          onClick={() => {
            ipcClient.sendMessage("play_rec");
          }}
        />
      }
      <IconButtonS icon="keyboard_arrow_right" label="Step Forward" disabled={play}
        onClick={() => ipcClient.sendMessage("step_forward")}
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
            // TODO: somehow this is called twice
            ipcClient.sendMessage("jump_to_ts", Math.floor(evt.detail.value));
          }}
          onInput={(evt: any) => {
            if (play) {
              ipcClient.sendMessage("pause_rec");
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
