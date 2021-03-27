import * as React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../redux/store'


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
  const imgData = useSelector((store: ApplicationState) => store.world.camSensors[0].imageData);
  const imgDataSemseg = useSelector((store: ApplicationState) => store.world.camSensors[0].semsegImg);
  const imgDataDepth = useSelector((store: ApplicationState) => store.world.camSensors[0].depthImg);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasRefSemseg = React.useRef<HTMLCanvasElement>(null);
  const canvasRefDepth = React.useRef<HTMLCanvasElement>(null);


  React.useEffect(() => {
    const canvasWidth = window.innerWidth * 0.20 + "px";

    // Set Image Data
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = imgData.height;
    canvas.width = imgData.width;
    context.putImageData(imgData, 0, 0);
    canvas.style.width = canvasWidth;

    // Set Semseg Data
    const canvasSemseg: HTMLCanvasElement = canvasRefSemseg.current;
    const contextSemseg = canvasSemseg.getContext('2d');
    canvasSemseg.height = imgDataSemseg.height;
    canvasSemseg.width = imgDataSemseg.width;
    contextSemseg.putImageData(imgDataSemseg, 0, 0);
    canvasSemseg.style.width = canvasWidth;
    canvasSemseg.style.marginBottom = "20px";

    // Set Image Data
    const canvasDepth: HTMLCanvasElement = canvasRefDepth.current;
    const contextDepth = canvasDepth.getContext('2d');
    canvasDepth.height = imgDataDepth.height;
    canvasDepth.width = imgDataDepth.width;
    contextDepth.putImageData(imgDataDepth, 0, 0);
    canvasDepth.style.width = canvasWidth;
    canvasDepth.style.marginBottom = "20px";
  });

  return <Container>
    <canvas ref={canvasRefDepth} height={0} width={0} />
    <canvas ref={canvasRefSemseg} height={0} width={0} />
    <canvas ref={canvasRef} height={0} width={0} />
  </Container>
}
