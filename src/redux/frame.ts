import { createAction, createReducer } from '@reduxjs/toolkit'
import { Frame, CamSensor } from '../com/interface/proto/frame'
import { Img } from '../com/interface/proto/types'
import { convertImg } from '../util/img_data'


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
  storage: FrameAdapted[]
}

const initialState: IReduxFrame = {
  data: null,
  storage: []
}

export const setData = createAction<Frame>('frame/setData');

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setData, (state, action) => {
      for (let i = 0; i < action.payload.camSensors.length; ++i) {
        if (action.payload.camSensors[i].isValid && action.payload.camSensors[i].img.data !== undefined) {
          const img = action.payload.camSensors[i].img;
          action.payload.camSensors[i].img.data = convertImg(img.data, img.width, img.height) as any;
        }
        else {
          action.payload.camSensors[i].img.data = null;
        }
      }
      state.data = action.payload as unknown as FrameAdapted;
      // Save in storage, but set all other image data to null to save storage
      state.storage.push(state.data);
      if (state.storage.length >= 30) {
        state.storage.shift();
      }
      for (let i = 0; i < (state.storage.length - 1); ++i) {
        for (let ii = 0; ii < (state.storage[i].camSensors.length); ++ii) {
          state.storage[i].camSensors[ii].img.data = null;
        }
      }
    })
    .addDefaultCase((state, _) => state)
});
