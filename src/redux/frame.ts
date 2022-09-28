import { bindActionCreators, createAction, createReducer } from '@reduxjs/toolkit'
import { Frame, CamSensor } from '../com/interface/proto/frame'
import { Img } from '../com/interface/proto/types'


// We need to adapt the proto interface here in order to convert Uint8Arrays to ImageData
// otherwise we get into trouble with redux and the rgb channels are mixed up
interface ImgAdapted extends Omit<Img, 'data'> {
  data: ImageData | null
}
interface CamSensorAdapted extends Omit<CamSensor, 'img'> {
  img: ImgAdapted
}
export interface FrameAdapted extends Omit<Frame, 'camSensors'> {
  camSensors: CamSensorAdapted[]
}


export interface IReduxFrame {
  data: FrameAdapted;
}

const initialState: IReduxFrame = {
  data: null
}

export const setData = createAction<Frame>('frame/setData')

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setData, (state, action) => {
      for (let i = 0; i < action.payload.camSensors.length; ++i) {
        if (action.payload.camSensors[i].isValid && action.payload.camSensors[i].img.data !== undefined) {
          const width = action.payload.camSensors[i].img.width;
          const height = action.payload.camSensors[i].img.height;
          let rawImgPayload = action.payload.camSensors[i].img.data;
          var imageData = new ImageData(width, height);
          let x = 0;
          let z = 0;
          while (x < rawImgPayload.length) {
            const b = rawImgPayload[x++];
            const g = rawImgPayload[x++];
            const r = rawImgPayload[x++];
            imageData.data[z++] = r; // red
            imageData.data[z++] = g; // green
            imageData.data[z++] = b; // blue
            imageData.data[z++] = 0xFF; // alpha
          }
          action.payload.camSensors[i].img.data = imageData as any;
        }
        else {
          action.payload.camSensors[i].img.data = null;
        }
      }
      state.data = action.payload as unknown as FrameAdapted;
    })
    .addDefaultCase((state, _) => state)
});
