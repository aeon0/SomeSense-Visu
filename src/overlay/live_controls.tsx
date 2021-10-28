import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector } from 'react-redux'
import { IconButton, IconButtonProps, IconButtonHTMLProps } from '@rmwc/icon-button'
import { ApplicationState } from '../redux/store'
import * as fs from 'fs'


class StoreWorldData {
  fileName: string = "";
  pathDir: string = "rec";
  isStoring: boolean = false;
  lastTs: number = null;

  constructor() {
    !fs.existsSync(this.pathDir) && fs.mkdirSync(this.pathDir);
  }

  startStoring() {
    const dateTime = new Date();
    const month: number = dateTime.getMonth() + 1; // it starts at 0
    const dateTimeStr = dateTime.getFullYear() + "-" + month + "-" + dateTime.getDate() + "_" +
                        dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds() + "." + dateTime.getMilliseconds();
    this.fileName = dateTimeStr + ".capnp.bin";
    const path = this.pathDir + "/" + this.fileName;
    fs.writeFileSync(path, "");
    this.isStoring = true;
    this.lastTs = null;
  }

  stopStoring() {
    this.isStoring = false;
    this.lastTs = null;
  }

  storeData(data: Uint8Array, currentTs: number) {
    if (this.isStoring && (this.lastTs === null || currentTs > this.lastTs)) {
      this.lastTs = currentTs;
      const path = this.pathDir + "/" + this.fileName;
      fs.appendFileSync(path, data);
    }
  }
}

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
  const [isStoring, setIsStoring] = React.useState(false);
  const currentTs = useSelector((store: ApplicationState) => store.world !== null ? store.world.timestamp : 0);
  const worldData = useSelector((store: ApplicationState) => store.worldRaw);

  const [storeData] = React.useState(() => new StoreWorldData());
  storeData.storeData(worldData, currentTs);

  // Key handlers
  React.useLayoutEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === " ") {
        setIsStoring(!isStoring);
        if (isStoring) storeData.stopStoring();
        else storeData.startStoring();
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
              setIsStoring(false);
              storeData.stopStoring();
            }}
          />
          <RecLight />
        </React.Fragment>
      :
        <IconButtonS icon="videocam" label="StartStoring"
          onClick={() => { 
            setIsStoring(true);
            storeData.startStoring();
          }}
        />
      }
    </ButtonContainer>

    <InfoBox>{usToTime(currentTs)} [{currentTs} us]</InfoBox>
  </Container>
}
