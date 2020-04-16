import * as React from 'react'
import styled from 'styled-components'
import { IReduxWorld } from '../redux/world/types'
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { Slider } from '@rmwc/slider'
import { IconButton } from '@rmwc/icon-button'
import { ThemeProvider } from '@rmwc/theme'
import { IPCServer } from '../com/tcp_sockets'


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
  const world: IReduxWorld = props.world;  // Null handling needed
  const ctrlData: ICtrlData = props.ctrlData; // Mull handling needed
  const ipcServer: IPCServer = props.ipcServer;

  const [playerTs, setPlayerTs] = React.useState(world !== null ? world.timestamp : 0);
  const [play, setPlay] = React.useState(ctrlData !== null ? ctrlData.isPlaying : false);

  // Update timestamp from props
  React.useEffect(() => {
    if (world.timestamp >= ctrlData.recLength) {
      ipcServer.sendMessage("pause_rec");
      setPlay(false);
    }
    setPlayerTs(world.timestamp); 
  }, [world !== null ? world.timestamp : 0]);
  React.useEffect(() => { setPlay(ctrlData.isPlaying); }, [ctrlData !== null ? ctrlData.isPlaying : false]);

  // Key handlers
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // TODO: When pressing backward or forward too fast, there is an error in the cpp code...
      if (e.keyCode === 101) { // 5, numpad
        if (play) {
          ipcServer.sendMessage("pause_rec");
          setPlay(false);
        }
        else {
          ipcServer.sendMessage("play_rec");
          setPlay(true);
        }
      }
      else if (e.keyCode === 100) { // 4 (arrow left), numpad
        if (!play) {
          ipcServer.sendMessage("step_backward");
        }
      }
      else if (e.keyCode === 102) { // 6 (arrow right), numpad
        if (!play) {
          ipcServer.sendMessage("step_forward");
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
        onClick={() => ipcServer.sendMessage("step_backward")}
      />
      {play ?
        <IconButtonS icon="pause" label="Pause" disabled={playerTs >= ctrlData.recLength}
          onClick={() => {
            ipcServer.sendMessage("pause_rec");
            setPlay(false);
          }}
        />
      :
        <IconButtonS icon="play_arrow" label="Play" disabled={playerTs >= ctrlData.recLength}
          onClick={() => {
            ipcServer.sendMessage("play_rec");
            setPlay(true);
          }}
        />
      }
      <IconButtonS icon="keyboard_arrow_right" label="Step Forward" disabled={play}
        onClick={() => ipcServer.sendMessage("step_forward")}
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
          onChange={evt => {
            // TODO: somehow this is called twice
            ipcServer.sendMessage("jump_to_ts", Math.floor(evt.detail.value));
            const currTs = Math.floor(evt.detail.value);
          }}
          onInput={evt => {
            if (play) {
              ipcServer.sendMessage("pause_rec");
              setPlay(false);
            }
            const currTs = Math.floor(evt.detail.value);
            setPlayerTs(currTs);
          }}
          min={0}
          max={ctrlData.recLength}
        />
      </SliderContainer>
    </ThemeProvider>

    <InfoBox>{usToTime(playerTs)} [{playerTs} us]</InfoBox>
  </Container>
}
