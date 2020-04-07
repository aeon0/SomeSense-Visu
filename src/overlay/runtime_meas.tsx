import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { hideRuntimeMeas } from '../redux/runtime_meas/actions'
import { ApplicationState } from '../redux/store'
import { IRuntimeMeasFrame } from "../redux/runtime_meas/reducer"
import { on } from 'cluster'


const WrapperDivS = styled.div`
  pointer-events: auto;
  background: #101010b0;
  color: white;
  width: 100%;
  height: auto;
  padding-top: 10px;
  position: relative;
  user-select: none;
`
const CloseBtnS = styled.span`
  position: absolute;
  right: 50%;
  bottom: -19px;
  cursor: pointer;
  color: #e2e2e2;
  width: 30px;
  background: #2d2d2d;
  height: 18px;
  line-height: 18px;
  text-align: center;
`
const ContentS = styled.div`
  width: 100%;
  overflow: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  cursor: move;
`
const FrameS = styled.div`
  display: inline-block;
  border-right: 1px dashed white;
`
const LegendS = styled.div`
  display: inline-block;
  background: #101010b0;
  margin-left: 10px;
  margin-right: 5px;
  position: fixed;
  width: 200px;
`
const MeasContentWrapperS = styled.div`
  margin-left: 215px;
`
const MeasS = styled.div`
  height: 26px;
  font-size: 12px;
  line-height: 26px;
`

// To drag and drop scroll horizontal
let isDown = false;
let startX: number;
let scrollLeft: number;
let sliderRef: React.RefObject<HTMLDivElement> = React.createRef();

function onMouseDown(e: any) {
  isDown = true;
  startX = e.pageX - sliderRef.current.offsetLeft;
  scrollLeft = sliderRef.current.scrollLeft;
}
function onMouseUpOrLeave(e: any) {
  isDown = false;
}
function onMouseMove(e: any) {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - sliderRef.current.offsetLeft;
  const walk = (x - startX); //* 3; //scroll-fast
  sliderRef.current.scrollLeft = scrollLeft - walk;
}


function usToMs(us: number) {
  return us / 1000.0;
}

function createMeasOrder(measFrameArr: IRuntimeMeasFrame[]): string[] {
  let mapping: string[] = [];
  for (let i = 0; i < measFrameArr.length; ++i) {
    // Sort by start time
    measFrameArr[i].meas.sort((a, b) => a.start - b.start);
    // If not found in list, add to list at new index
    for (var meas of measFrameArr[i].meas) {
      if (!mapping.includes(meas.name)) {
        mapping.push(meas.name);
      }
    }
  }
  return mapping;
}

function createRuntimeMeasFrame(key: string, measFrame: IRuntimeMeasFrame, pixelPerMs: number, measOrder: string[]): JSX.Element {
  // Calc length of frame, take plannedLength unless any of the measurements shows a later end time
  let measContent: JSX.Element[] = [];
  let maxTimeMs = measFrame.plannedFrameLength;
  let i = 0;
  for (let measName of measOrder) {
    // Find meas with that name
    const meas = measFrame.meas.find((val) => measName === val.name);
    if (meas) {
      // Start and end time in [ms] relative to frame start
      let startTimeMs = usToMs(meas.start - measFrame.frameStart);
      let endTimeMs = startTimeMs + meas.duration;

      let background = "#73ab29";
      if (endTimeMs > measFrame.plannedFrameLength) {
        // Show red in case the endtime passes the frame length
        background = "#b55138";
      }

      measContent.push(<MeasS key={i}>
        <div style={{
          marginLeft: startTimeMs * pixelPerMs,
          width: (endTimeMs - startTimeMs) * pixelPerMs,
          background,
         }}>{meas.duration.toFixed(2)} ms</div>
      </MeasS>);

      if (endTimeMs > maxTimeMs) {
        maxTimeMs = endTimeMs;
      }
    }
    else {
      // Meas does not exist in this frame
      return <MeasS></MeasS>;
    }
    i++;
  }

  return <FrameS key={key} style={{width: maxTimeMs * pixelPerMs}}>
    {measContent}
  </FrameS>;
}

export function RuntimeMeas() {
  const dispatch = useDispatch();

  const data = useSelector((store: ApplicationState) => store.runtimeMeasStore.data);
  React.useEffect(() => {
    sliderRef.current.scrollLeft = sliderRef.current.scrollWidth;
  });

  let pixelPerMs: number = 10; // Scale of each frame, pixel per millisecond
  const measOrder: string[] = createMeasOrder(data);

  return <WrapperDivS>
    <CloseBtnS className="material-icons" onClick={() => dispatch(hideRuntimeMeas())}>keyboard_arrow_up</CloseBtnS>
    <ContentS ref={sliderRef} onMouseDown={onMouseDown} onMouseUp={onMouseUpOrLeave} onMouseLeave={onMouseUpOrLeave} onMouseMove={onMouseMove}>
      <LegendS>
        {measOrder.map((value, idx) => <MeasS key={idx}>
          {value}
        </MeasS>)}
      </LegendS>
      <MeasContentWrapperS>
        {data.map((value, idx) => createRuntimeMeasFrame(idx.toString(), value, pixelPerMs, measOrder))}
      </MeasContentWrapperS>
    </ContentS>
  </WrapperDivS>
}
