import * as React from 'react'
import styled from 'styled-components'
import * as promises from "timers/promises"
import { useSelector } from 'react-redux'
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
  const refSliderInput = React.useRef(null);

  const currentTs = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.relTs : 0);
  const plannedFrameLength = useSelector((store: AppState) => store.frame.data !== null ? store.frame.data.plannedFrameLength : 0);
  const play = useSelector((store: AppState) => store.recMeta.isPlaying);
  const recLength = useSelector((store: AppState) => store.recMeta.recLength);

  const [slider, setSlider] = React.useState<MDCSlider>();
  let [sliderTs, setSliderTs] = React.useState(null);

  // Ugh: Custom events... why??
  React.useEffect(() => {
    const mdcSlider = new MDCSlider(refSlider.current);
    mdcSlider.setValue(currentTs);
    setSlider(mdcSlider);
    function handleChange() {
      props.client.sendMsg("frame_ctrl", {action: "jump_to_rel_ts", rel_ts: mdcSlider.getValue()}, async () => {
        // Dirty hack in the hope that in 250ms the server has sent a new frame and currentTs is updated.
        await promises.setTimeout(250);
        setSliderTs(null);
      });
    }
    function handleInput() {
      setSliderTs(mdcSlider.getValue());
    }
    mdcSlider.listen("MDCSlider:change", handleChange);
    mdcSlider.listen("MDCSlider:input", handleInput);
    return () => {
      mdcSlider.unlisten("MDCSlider:change", handleChange);
      mdcSlider.unlisten("MDCSlider:input", handleInput);
      mdcSlider.destroy();
    }
  }, []);

  if (slider !== undefined && sliderTs == null) {
    slider.setDisabled(play);
    slider.setValue(currentTs);
  }

  return <Container>
    <ButtonContainer>
      <IconButtonS icon="keyboard_arrow_left" disabled={play || (currentTs <= plannedFrameLength * 1000.0)}
        onClick={() => {
          props.client.sendMsg("frame_ctrl", {action: "step_back"}, () => {});
        }}
      />
      {play && <IconButtonS icon="pause" disabled={currentTs >= (recLength - plannedFrameLength * 1000.0)}
        onClick={() => {
          console.log("PAUSE");
          props.client.sendMsg("frame_ctrl", {action: "pause"}, () => {});
        }}
      />}
      {!play && <IconButtonS icon="play_arrow" disabled={currentTs >= (recLength - plannedFrameLength * 1000.0)}
        onClick={() => {
          props.client.sendMsg("frame_ctrl", {action: "play"}, () => {});
        }}
      />}
      <IconButtonS icon="keyboard_arrow_right" disabled={play || (currentTs >= (recLength - plannedFrameLength * 1000.0))}
        onClick={() => {
          props.client.sendMsg("frame_ctrl", {action: "step_forward"}, () => {});
        }}
      />
    </ButtonContainer>

    <VerticalContainerS>
      <SliderContainer>
        <SliderS ref={refSlider} className="mdc-slider">
          <input
            ref={refSliderInput}
            className="mdc-slider__input"
            type="range"
            min="0" 
            max={recLength}
            value={currentTs}
            name="timestamp"
            readOnly
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
      <InfoBox>{usToTime(slider !== undefined ? slider.getValue() : 0)} [{slider !== undefined ? slider.getValue(): 0} us]</InfoBox>
    </VerticalContainerS>
  </Container>
}
