import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { ICom } from '../com/icom'
import { AppState } from '../redux/store'
import { IconButton } from '../util/mdc/icon_button'
import { setSaveToFile } from '../redux/frame'


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
  padding: 5px;
  padding-left: 15px;
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
  padding: 15px;
  width: 100%;
  justify-content: flex-end;
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

export function LiveControls(props: {client: ICom}) {
  const dispatch = useDispatch();

  const currentTs = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.relTs : -1);
  const isSaving = useSelector((store: AppState) => store.frame.isSaving);

  if (currentTs == -1) {
    return;
  }

  return <Container>
    <ButtonContainer>
      {isSaving?
        <React.Fragment>
          <IconButtonS icon="stop"
            onClick={() => {
              dispatch(setSaveToFile([false, ""]));
            }}
          />
          <RecLight />
        </React.Fragment>
      :
        <IconButtonS icon="videocam"
          onClick={() => {
            const now = new Date();
            const fileName = "rec_" + now.toISOString();
            dispatch(setSaveToFile([true, fileName]));
          }}
        />
      }
    </ButtonContainer>

    <InfoBox>{usToTime(currentTs)} [{currentTs} us]</InfoBox>
  </Container>
}
