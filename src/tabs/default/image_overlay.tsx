import * as React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../redux/store'
import { getImgData } from '../../util/img_data'


const Container = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  background: transparent;
  display: flex;
  justify-content: space-between;
  width: auto;
  right: 20px;
  bottom: 150px;
  display: grid;
`

export function ImageOverlay(props: any) {
  const img = useSelector((store: AppState) => getImgData(store, 0));
  const canvasRef = React.useRef<HTMLCanvasElement>();

  React.useEffect(() => {
    if (img == null) return;
    const canvasWidth = window.innerWidth * 0.20 + "px";

    // Set Image Data
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = img.height;
    canvas.width = img.width;
    context.putImageData(img.data, 0, 0);
    canvas.style.width = canvasWidth;
  });

  return <Container>
    <canvas ref={canvasRef} height={0} width={0} />
  </Container>
}
