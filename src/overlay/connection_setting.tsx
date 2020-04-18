import * as React from 'react'
import styled from 'styled-components'
import { Button } from '@rmwc/button'
import { Elevation } from '@rmwc/elevation'
import { LinearProgress } from '@rmwc/linear-progress'
import { useDispatch, useSelector } from 'react-redux'
import { setConnecting } from '../redux/connection/actions'
import { ApplicationState } from '../redux/store'


const ButtonS = styled(Button)`
  pointer-events: auto;
  background: #bf4949 !important;
`
const ConnectingInfoS = styled(Elevation)`
  background: white;
  padding: 20px;
  width: 300px;
  text-align: center;
  position: relative;
`
const ContainerS = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const LinearProgressS = styled(LinearProgress)`
  top: 0px;
  left: 0px;
  position: absolute;
`
const ConnectTo = styled.span`
  font-size: 10px;
`

export function ConnectionSetting() {
  const dispatch = useDispatch();
  const connected = useSelector((store: ApplicationState) => store.connection.connected);
  const connecting = useSelector((store: ApplicationState) => store.connection.connecting);
  const waitForData = useSelector((store: ApplicationState) => store.connection.waitForData);
  const host = useSelector((store: ApplicationState) => store.connection.host);

  return <ContainerS>
    {!connected && !connecting &&
      <ButtonS
        raised
        label="Connection Failed: Retry"
        onClick={() => dispatch(setConnecting())}
      />
    }
    {(connecting || waitForData)&&
      <ConnectingInfoS z={2}>
        <LinearProgressS />
        <div>{connecting ? "Connecting..." : "Waiting For Data..."}</div>
        <ConnectTo>Host: {host}</ConnectTo>
      </ConnectingInfoS>
    }
  </ContainerS>
}
