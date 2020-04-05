import * as React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { hideRuntimeMeas } from '../redux/runtime_meas/actions'
import { IRuntimeMeas } from '../redux/world/types'


const WrapperDivS = styled.div`
  pointer-events: auto;
  background: #101010b0;
  color: white;
  width: 100%;
  min-height: 200px;
`
const CloseBtnS = styled.span`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`

export function RuntimeMeas(props: any) {
  const dispatch = useDispatch();

  const frameTs: number = useSelector((store: any) => store.world.timestamp);
  const runtimeMeas: IRuntimeMeas[] = useSelector((store: any) => store.world.runtimeMeas);
  

  console.log(runtimeMeas);

  return <WrapperDivS>
    <CloseBtnS className="material-icons" onClick={() => dispatch(hideRuntimeMeas())}>close</CloseBtnS>
  </WrapperDivS>
}
