import * as React from 'react'
import styled from 'styled-components'
import { Card, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { LinearProgress } from '@rmwc/linear-progress'
import { useDispatch, useSelector } from 'react-redux'
import { setConnecting } from '../redux/connection/actions'
import { ApplicationState } from '../redux/store'


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
const CardS = styled(Card)`
  pointer-events: auto;
  border-radius: 0px;
  background: white;
  min-width: 350px;
  position: absolute;
`
const InfoS = styled.div`
  height: 50px;
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 10px;
`
const LinearProgressS = styled(LinearProgress)`
  top: 0px;
  left: 0px;
  position: absolute;
`
const CardActionButtonsS = styled(CardActionButtons)`
  width: 100%;
`
const Spacer = styled.div`
  flex: 1 1 auto;
`

export function ConnectionSetting() {
  const dispatch = useDispatch();
  const connected = useSelector((store: ApplicationState) => store.connection.connected);
  const connecting = useSelector((store: ApplicationState) => store.connection.connecting);
  const waitForData = useSelector((store: ApplicationState) => store.connection.waitForData);
  const host = useSelector((store: ApplicationState) => store.connection.host);
  const port = useSelector((store: ApplicationState) => store.connection.port);

  let infoStr = "unkown";
  const hostStr = host + ":" + port.toString();
  if (connecting) {
    if (waitForData) infoStr = "Wait for data from " + hostStr + "...";
    else infoStr = "Connecting to " + hostStr + "...";
  }
  else {
    infoStr = "Host: " + hostStr;
  }

  if (!connected) {
    return <ContainerS>
      <CardS>
        {connecting && <LinearProgressS /> }
        <InfoS>{infoStr}</InfoS>
        <CardActions>
          <CardActionButtonsS>
            {!connecting && <CardActionButton onClick={() => dispatch(setConnecting())}>Connect</CardActionButton>}
            <Spacer />
            {connecting ? 
              <CardActionButton onClick={() => dispatch(setConnecting(false))}>Cancel</CardActionButton>
              :
              <CardActionButton> Change Host</CardActionButton>
            }
          </CardActionButtonsS>
        </CardActions>
      </CardS>
    </ContainerS>
  }
  return null;
}
