import * as React from 'react'
import styled from 'styled-components'
import { Button } from '@rmwc/button'
import { Elevation } from '@rmwc/elevation'
import { LinearProgress } from '@rmwc/linear-progress'
import { useDispatch, useSelector } from 'react-redux'
import { setConnecting } from '../redux/connection/actions'


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


export function ConnectionSetting() {
  const dispatch = useDispatch();
  const connected: string = useSelector((store: any) => store.connection.connected);
  const connecting: string = useSelector((store: any) => store.connection.connecting);

  return <ContainerS>
    {!connected && !connecting &&
      <ButtonS
        raised
        label="Connection Failed: Retry"
        onClick={() => dispatch(setConnecting())}
      />
    }
    {connecting &&
      <ConnectingInfoS z={2}>
        <LinearProgressS />
        Connecting...
      </ConnectingInfoS>
    }
  </ContainerS>
}
