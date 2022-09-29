import * as React from 'react'
import styled from 'styled-components'
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../redux/store'
import { ICom } from '../com/icom'
import { MDCSlider } from '@material/slider'
import { IconButton } from '../util/mdc/icon_button'


const Container = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #ffffff12;
  display: flex;
  justify-content: space-around;
`
const VerticalContainerS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px;
`
const SliderContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`
const SliderS = styled.div`
  pointer-events: auto;
`
const IconButtonS = styled(IconButton)`
  pointer-events: auto;
  color: #EEE;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
`
const InfoBox = styled.div`
  color: #aaa;
  font-size: 14px;
  text-align: center;
  display: grid;
  place-items: center;
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

export function RecControls(props: {client: ICom}) {
  const refSlider = React.useRef(null);
  const dispatch = useDispatch();

  const currentTs = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.timestamp : -1);
  const play = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.recData.isPlaying : false);
  const recLength = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.recData.recLength : 0);

  const [playerTs, setPlayerTs] = React.useState(currentTs);
  React.useEffect(() => setPlayerTs(currentTs), [currentTs]);
  React.useEffect(() => { new MDCSlider(refSlider.current) }, []);

  return <Container>
    <ButtonContainer>
      <IconButtonS icon="keyboard_arrow_left" disabled={play}
        onClick={() => {
          console.log("Step Backwards");
        }}
      />
      {play && <IconButtonS icon="pause" disabled={currentTs >= recLength}
        onClick={() => {
          console.log("Pause");
        }}
      />}
      {!play && <IconButtonS icon="play_arrow" disabled={currentTs >= recLength}
        onClick={() => {
          console.log("Play");
        }}
      />}
      <IconButtonS icon="keyboard_arrow_right" disabled={play}
        onClick={() => {
          console.log("Step Forward");
        }}
      />
    </ButtonContainer>

    <VerticalContainerS>
      <SliderContainer>
        <SliderS ref={refSlider} className={cn("mdc-slider", play ? "mdc-slider--disabled" : "")}>
          <input
            className="mdc-slider__input"
            type="range"
            min="0" 
            max={recLength}
            value={playerTs}
            name="timestamp"
            onChange={(evt) => {
              console.log("Change to " + evt.target.value)
            }}
            disabled={play ? true : false}
          />
          <div className="mdc-slider__track">
            <div className="mdc-slider__track--inactive"></div>
            <div className="mdc-slider__track--active">
              <div className="mdc-slider__track--active_fill"></div>
            </div>
          </div>
          <div className="mdc-slider__thumb">
            <div className="mdc-slider__thumb-knob"></div>
          </div>
        </SliderS>
      </SliderContainer>
      <InfoBox>{usToTime(playerTs)} [{playerTs} us]</InfoBox>
    </VerticalContainerS>
  </Container>
}
