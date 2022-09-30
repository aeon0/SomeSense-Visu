import * as React from 'react'
import styled from 'styled-components'
import { MDCLinearProgress } from '@material/linear-progress'


const Container = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  background: #00000058;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 65px;
`
const TextS = styled.span`
  color: white;
  padding-bottom: 18px;
`

export function WaitForConnection() {
  const barRef = React.useRef();

  React.useEffect(() => {
    const linearProgress = new MDCLinearProgress(barRef.current);
  }, []);

  return <Container>
    <div ref={barRef} role="progressbar" className="mdc-linear-progress mdc-linear-progress--indeterminate" >
      <div className="mdc-linear-progress__buffer">
        <div className="mdc-linear-progress__buffer-bar"></div>
        <div className="mdc-linear-progress__buffer-dots"></div>
      </div>
      <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span className="mdc-linear-progress__bar-inner"></span>
      </div>
      <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span className="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>

    <TextS>Waiting for connection...</TextS>
  </Container>
}
