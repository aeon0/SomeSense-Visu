import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { hideRuntimeMeas } from '../redux/runtime_meas/actions'
import { ApplicationState } from '../redux/store'
import { IRuntimeMeasFrame } from "../redux/runtime_meas/reducer"


const WrapperDivS = styled.div`
  pointer-events: auto;
  background: #101010b0;
  color: white;
  width: 100%;
  height: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  position: relative;
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
`
const FrameS = styled.span`
  border: 1px solid red;
  display: inline-block;
`

function fillRuntimeMeasFrame(measFrame: IRuntimeMeasFrame) {
  return <div>{measFrame.frameStart}</div>;
}

export function RuntimeMeas() {
  const dispatch = useDispatch();

  const data = useSelector((store: ApplicationState) => store.runtimeMeasStore.data);

  let pxPerMs: number = 10; // Scale of each frame, pixel per millisecond

  // Sort by start timestamp
  // runtimeMeas.sort((a, b) => a.start - b.start);

  return <WrapperDivS>
    <CloseBtnS className="material-icons" onClick={() => dispatch(hideRuntimeMeas())}>keyboard_arrow_up</CloseBtnS>
    <ContentS>
      {data.map((value, idx) => {
        return <FrameS key={idx}>
          {fillRuntimeMeasFrame(value)}
        </FrameS>
      })} 
    </ContentS>
  </WrapperDivS>
}
