import * as React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../../redux/store'


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
const CanvasS = styled.canvas`
  margin-top: 10px;
`

export function ImageOverlay(props: any) {
  function isValid(store: AppState) {
    return store.frame.displayImgs !== null &&
      store.frame.displayImgs.length > 0;
  }
  
  function setImg(canvas: HTMLCanvasElement, imgData: ImageData, widthStr: string) {
      const context = canvas.getContext('2d');
      canvas.height = imgData.height;
      canvas.width = imgData.width;
      context.putImageData(imgData, 0, 0);
      canvas.style.width = widthStr;
  }

  const imgData = useSelector((store: AppState) => isValid(store) ? store.frame.displayImgs[0].img : null);
  const semsegData = useSelector((store: AppState) => isValid(store) ? store.frame.displayImgs[0].semsegImg : null);
  const depthData = useSelector((store: AppState) => isValid(store) ? store.frame.displayImgs[0].depthImg : null);

  const canvasRefImg = React.useRef<HTMLCanvasElement>();
  const canvasRefSemseg = React.useRef<HTMLCanvasElement>();
  const canvasRefDepth = React.useRef<HTMLCanvasElement>();

  React.useEffect(() => {
    const canvasWidth = window.innerWidth * 0.20 + "px";

    if (imgData) {
      setImg(canvasRefImg.current, imgData, canvasWidth);
    }
    if (semsegData) {
      setImg(canvasRefSemseg.current, semsegData, canvasWidth);
    }
    if (depthData) {
      setImg(canvasRefDepth.current, depthData, canvasWidth);
    }
  });

  return <Container>
    <CanvasS ref={canvasRefDepth} height={0} width={0} />
    <CanvasS ref={canvasRefSemseg} height={0} width={0} />
    <CanvasS ref={canvasRefImg} height={0} width={0} />
  </Container>
}
